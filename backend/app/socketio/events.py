import socketio

# Initialize Socket.IO and Redis server
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=["http://localhost:3000", "http://192.168.139.238:3000"]
)

@sio.event
async def connect(sid, environ, auth):
    await sio.enter_room(sid, "sample_room")
    print(f"Client {sid} joined room sample_room")

@sio.event
async def ice_candidate(sid, data):
    room = data.get("room")
    candidate = data.get("candidate")
    await sio.emit("receive_ice_candidate", {"candidate": candidate, "sid": sid}, room=room)

@sio.event
async def join_room(sid, data):
    peer = data.get('peer')
    user = data.get('user', 'Anonymous')
    await sio.emit('room_joined', {'user': user, 'peer': peer}, room="sample_room", skip_sid=sid)

@sio.event
async def leave_room(sid, data):
    room = data.get('room')
    await sio.leave_room(sid, room)
    await sio.emit('room_left', {'room': room}, room=room)
    print(f"Client {sid} left room {room}")
