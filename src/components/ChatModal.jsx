import { useEffect, useRef, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import io from 'socket.io-client'

const socket = io('http://localhost:3300')

export default function ChatModal({ isOpen, onClose, provider, user, task }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [otherParty, setOtherParty] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const localUserData =
      localStorage.getItem('provider') || localStorage.getItem('user')

    if (localUserData) {
      const parsedUser = JSON.parse(localUserData)
      setCurrentUser(parsedUser)

      if (provider && provider._id !== parsedUser._id) {
        setOtherParty(provider)
      } else if (user && user._id !== parsedUser._id) {
        setOtherParty(user)
      }
    }
  }, [user, provider])

  if (!currentUser || !otherParty) return null

  const tokenKey = localStorage.getItem('provider') ? 'providerToken' : 'token'

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-full sm:max-w-md w-[90vw] sm:w-[400px]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="h-[550px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col"
          >
            <ChatUI
              currentUser={currentUser}
              otherUser={otherParty}
              tokenKey={tokenKey}
              task={task}
              onClose={onClose}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ChatUI({ currentUser, otherUser, tokenKey, task, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const token =
    typeof window !== 'undefined' ? localStorage.getItem(tokenKey) : null

  // Fetch chat history
  useEffect(() => {
    if (!otherUser?._id || !token || !task?._id) return

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:3300/api/messages/${task._id}`,
          {
            headers: { Authorization: token },
          }
        )
        const data = await res.json()

        const normalized = data.map((msg) => ({
          ...msg,
          sender: typeof msg.sender === 'object' ? msg.sender._id : msg.sender,
          receiver:
            typeof msg.receiver === 'object' ? msg.receiver._id : msg.receiver,
        }))

        setMessages(normalized)
      } catch (err) {
        console.error('Failed to fetch chat:', err)
      }
    }

    fetchMessages()
  }, [otherUser, token, task?._id])

  // Join/leave socket room
  useEffect(() => {
    if (!task?._id || !currentUser?.id) return

    socket.emit('joinTask', {
      taskId: task._id,
      userId: currentUser?.id,
    })

    return () => {
      socket.emit('leaveTask', {
        taskId: task._id,
        userId: currentUser.id,
      })
    }
  }, [task?._id, currentUser?.id])

  // Handle incoming messages
  useEffect(() => {
    const handleReceive = (data) => {
      const taskMatches = data.taskId === task._id

      const senderId =
        typeof data.sender === 'object' ? data.sender._id : data.sender
      const receiverId =
        typeof data.receiver === 'object' ? data.receiver._id : data.receiver

      const isRelevant =
        taskMatches &&
        ((senderId === currentUser?.id && receiverId === otherUser?._id) ||
          (senderId === otherUser?._id && receiverId === currentUser?.id))

      if (isRelevant) {
        setMessages((prev) => [
          ...prev,
          {
            ...data,
            sender: senderId,
            receiver: receiverId,
          },
        ])
      }
    }

    socket.on('receiveMessage', handleReceive)
    return () => socket.off('receiveMessage', handleReceive)
  }, [currentUser?.id, otherUser?._id, task?._id])

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [inputRef])

  const sendMessage = async () => {
    if (!input.trim()) return

    const messageData = {
      sender: currentUser._id,
      receiverId: otherUser._id,
      text: input,
    }

    try {
      const res = await fetch(
        `http://localhost:3300/api/messages/${task._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify(messageData),
        }
      )

      if (res.ok) {
        setInput('')
      }
    } catch (err) {
      console.error('Send message failed:', err)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-[#1A3D8F] text-white flex items-center justify-between">
        <h2 className="text-base font-semibold text-white truncate">
          Chat with {otherUser?.name || 'User'}
        </h2>
        <button onClick={onClose} className="text-white hover:text-gray-300">
          <FaTimes size={16} />
        </button>
      </div>

      {/* Message Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#F9FAFB]"
      >
        {messages.map((msg, idx) => {
          const isCurrentUser = msg.sender === currentUser?.id
          return (
            <div
              key={idx}
              className={`relative group max-w-[75%] px-4 py-2 rounded-lg text-sm break-words ${
                isCurrentUser
                  ? 'bg-[#1A3D8F] text-white ml-auto text-right'
                  : 'bg-[#E0E0E0] text-gray-800 text-left'
              }`}
            >
              <div>{msg.text}</div>
              {msg.timestamp && (
                <div
                  className={`text-xs opacity-60 mt-1 ${
                    isCurrentUser ? 'text-right' : 'text-left'
                  } text-[#999999]`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              )}
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t flex gap-2 bg-white">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D8F]"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-[#1A3D8F] text-white px-4 py-2 rounded-full hover:bg-[#163373] transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
