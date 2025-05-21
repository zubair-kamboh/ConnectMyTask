// src/socket.js
import { io } from 'socket.io-client'
export const socket = io('https://api.connectmytask.xyz', {
  transports: ['websocket'],
})
