import { useEffect, useRef, useState } from 'react'
import { FaPaperclip, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { socket } from '../socket'
import Loader from './Loader'

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
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const token =
    typeof window !== 'undefined' ? localStorage.getItem(tokenKey) : null
  const [imageFile, setImageFile] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
    }
  }
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
    if (!input.trim() && !imageFile) return

    const formData = new FormData()
    formData.append('sender', currentUser._id)
    formData.append('receiverId', otherUser._id)
    formData.append('text', input)
    if (imageFile) formData.append('image', imageFile)

    try {
      setIsSending(true)
      const res = await fetch(
        `http://localhost:3300/api/messages/${task._id}`,
        {
          method: 'POST',
          headers: { Authorization: token },
          body: formData,
        }
      )

      if (res.ok) {
        setInput('')
        setImageFile(null)
      }
    } catch (err) {
      console.error('Send message failed:', err)
    } finally {
      setIsSending(false)
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
              {msg.image && (
                <img
                  src={`${msg.image}`}
                  alt="attachment"
                  className="mt-2 rounded max-w-full"
                />
              )}
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {isSending ? (
        <Loader />
      ) : (
        <div className="p-3 border-t flex flex-col gap-2 bg-white">
          {imageFile && (
            <div className="relative max-w-xs">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                className="w-32 h-32 object-cover rounded"
              />
              <button
                onClick={() => setImageFile(null)}
                className="absolute top-0 right-0 bg-white text-red-500 p-1 rounded-full"
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D8F]"
              placeholder="Type a message..."
            />
            <label className="relative cursor-pointer">
              <div className="w-9 h-9 bg-[#E0E0E0] hover:bg-[#d0d0d0] flex items-center justify-center rounded-full text-[#1A3D8F]">
                <FaPaperclip size={16} />
              </div>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
            </label>

            <button
              onClick={sendMessage}
              disabled={isSending}
              className="bg-[#1A3D8F] text-white px-4 py-2 rounded-full hover:bg-[#163373] transition disabled:opacity-50 flex items-center gap-2"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
