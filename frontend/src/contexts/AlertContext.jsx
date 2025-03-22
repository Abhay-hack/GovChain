// frontend/src/contexts/AlertContext.jsx
import React, { createContext, useState, useEffect, useRef } from 'react';
import { initSocket } from '../utils/socket.js';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    console.log('Setting up Socket.io in AlertContext');
    const socket = initSocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket.io connected:', socket.id);
    });

    socket.on('newAlert', (message) => {
      console.log('New alert received:', message);
      setAlerts((prev) => [...prev, { message, timestamp: Date.now() }]);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connect error:', err.message);
    });

    socket.on('disconnect', () => {
      console.log('Socket.io disconnected');
    });

    return () => {
      console.log('Cleaning up Socket.io');
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const clearAlert = (index) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AlertContext.Provider value={{ alerts, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
};