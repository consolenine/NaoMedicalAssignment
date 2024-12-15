import io from 'socket.io-client';

const socket = io(
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://localhost:8000",
  { transports: ["websocket"] }
);

export default socket;