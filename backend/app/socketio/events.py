import socketio
from fastapi import Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException
from ..core import get_db
from ..core.security import verify_token
from ..models import ChatSession, User
from ..services import translate_text

# Initialize Socket.IO
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=["http://localhost:3000"],
    logger=True,
    engineio_logger=True,
)

ADMIN_ROOM = 'admin_updates'

@sio.event
async def connect(sid, environ, auth):
    try:
        if not auth:
            raise ValueError("Authentication is missing")
        token = auth.get("token")
        if not token:
            raise ValueError("Authentication token is missing")

        # Verify the token
        user_data = verify_token(token)

        # Store user info in the session
        async with sio.session(sid) as session:
            session["user"] = user_data["sub"]
            session["role"] = user_data["role"]
        sio.logger.info(f"User {user_data['sub']} connected")
    except ValueError as e:
        sio.logger.info(f"Authentication failed: {e}")
        # await sio.disconnect(sid)
    except HTTPException as e:
        sio.logger.info(f"Authentication error: {e.detail}")
        # await sio.disconnect(sid)

@sio.event
async def disconnect(sid):
    rooms = sio.rooms(sid)
    for room in rooms:
        await sio.leave_room(sid, room)
    sio.logger.info(f"User {sid} disconnected")

@sio.event
async def admin_online(sid, data):
    db: Session = next(get_db())
    user = data.get('user')
    site_user = db.query(User).filter(User.email == user).first()
    if not site_user:
        return

    if site_user.role == 'admin':
        awaiting_chats = db.query(ChatSession).filter(
            ChatSession.staff_id == site_user.id).all()
        data = []
        for chat in awaiting_chats:
            patient_name = db.query(User).get({"id":chat.patient_id}).name
            data.append({
                'room': chat.room_id,
                'patient': patient_name,
                'status': chat.status,
                'start_time': chat.start_time.strftime("%Y-%m-%d %H:%M:%S"),
            })
        await sio.enter_room(sid, ADMIN_ROOM)
        await sio.emit('awaiting_patients', data, room=ADMIN_ROOM)

@sio.event
async def create_chat_session(sid, data):
    db: Session = next(get_db())
    user = data.get('user')
    room = data.get('room')
    patient = db.query(User).filter(User.email == user).first()
    if not user:
        return

    admin_user = db.query(User).filter(User.email == 'admin@nma.test').first()
    chat_session = ChatSession(
        patient_id=patient.id,
        staff_id=admin_user.id,
        room_id=room
    )
    db.add(chat_session)
    db.commit()
    db.refresh(chat_session)
    await sio.emit('chat_session_created', {'staff_assigned': admin_user.name}, to=sid)
    await sio.emit(
        'chat_session_created',
        {
            'room': chat_session.room_id,
            'status': chat_session.status,
            'start_time': chat_session.start_time.strftime("%Y-%m-%d %H:%M:%S"),
            'patient': patient.name,
        }, room=ADMIN_ROOM)

@sio.event
async def join_room(sid, data):
    room_id = data.get('roomID')
    user = data.get('user', 'Anonymous')
    peer_id = data.get('peer')
    await sio.enter_room(sid, room_id)
    await sio.emit('room_joined', {'user': user, 'roomID': room_id, 'peer': peer_id}, room=room_id, skip_sid=sid)

@sio.event
async def set_lang_preference(sid, data):
    lang = data.get('lang')
    room = data.get('room')
    db: Session = next(get_db())
    chat_session = db.query(ChatSession).filter(ChatSession.room_id == room).first()
    if not chat_session:
        return
    async with sio.session(sid) as session:
        user = session.get("user")
        role = session.get("role")
    sio.logger.info(f"User {user} set language preference to {lang} in room {room}")
    if role == 'patient':
        chat_session.patient_language = lang
    else:
        chat_session.staff_language = lang
    db.commit()

@sio.event
async def leave_room(sid, data):
    room = data.get('room')
    await sio.leave_room(sid, room)
    await sio.emit('room_left', {'room': room}, room=room)
    print(f"Client {sid} left room {room}")

@sio.event
async def room_speech_text(sid, data):
    room = data.get('room')
    text = data.get('text')

    async with sio.session(sid) as session:
        user = session.get("user")
        role = session.get("role")

    db: Session = next(get_db())
    chat_session = db.query(ChatSession).filter(ChatSession.room_id == room).first()
    target_lang = None
    if not user or not chat_session:
        return

    if role == 'patient':
        target_lang = chat_session.patient_lang
        chat_session.patient_transcript.append(text)
        db.commit()
    else:
        target_lang = chat_session.staff_lang
        chat_session.staff_transcript.append(text)

    translated = text
    if target_lang:
        translated = translate_text(text, target_lang)

    await sio.emit('speech_text', {'original': text, 'translated': translated}, room=room, skip_sid=sid)