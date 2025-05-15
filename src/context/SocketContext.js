// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useMemo } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  // 1️⃣ Create the socket once, _before_ children render
  const socket = useMemo(
    () =>
      io('http://localhost:3300', {
        transports: ['websocket'], // skip polling if you like
        autoConnect: true,
      }),
    []
  )

  // 2️⃣ Clean up on unmount
  useEffect(() => {
    return () => {
      socket.disconnect()
    }
  }, [socket])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => {
  const socket = useContext(SocketContext)
  if (!socket) {
    throw new Error('useSocket must be used within a <SocketProvider>')
  }
  return socket
}
