import socketio
from fastapi import Depends
from sqlalchemy.orm import Session
from ..core import get_db
from ..models import ChatSession, User

# Initialize Socket.IO
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=["http://localhost:3000"],
)

#TODO: Implement authentication for socketio

@sio.event()
async def admin_online(sid, data):
    db: Session = next(get_db())
    user = data.get('user')
    site_user = db.query(User).filter(User.email == user).first()
    if not site_user:
        return
    await sio.emit('debug', site_user.role)
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
        await sio.emit('awaiting_patients', data, to=sid)

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


@sio.event
async def join_room(sid, data):
    room_id = data.get('roomID')
    user = data.get('user', 'Anonymous')
    await sio.enter_room(sid, room_id)
    await sio.emit('room_joined', {'user': user, 'roomID': room_id}, room=room_id, skip_sid=sid)

@sio.event
async def leave_room(sid, data):
    room = data.get('room')
    await sio.leave_room(sid, room)
    await sio.emit('room_left', {'room': room}, room=room)
    print(f"Client {sid} left room {room}")
