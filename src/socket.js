// src/socket.js
import { io } from 'socket.io-client'
export const socket = io('http://localhost:3300', { transports: ['websocket'] })
