// frontend/src/utils/socket.js
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';

export const initSocket = () => {
  console.log('Initializing Socket.io with URL:', SOCKET_URL);
  const socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'], // Prefer WebSocket, fallback to polling
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    withCredentials: true,
  });
  return socket;
};