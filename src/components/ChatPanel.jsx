// components/ChatPanel.jsx
import { useEffect, useRef, useState } from 'react'
import { SendHorizonal, Smile, Image as ImageIcon } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import Avatar from './Avatar' // move Avatar to its own file too (optional)
import axios from 'axios'
import { socket } from '../socket'
import { useTheme } from '@mui/material'
import Loader from './Loader'

export default function ChatPanel({ message, closeChat, token }) {
  const [inputValue, setInputValue] = useState('')
  const [chatLog, setChatLog] = useState([])
  const [typing, setTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef(null)
  const [imageFile, setImageFile] = useState(null)
  const [sending, setSending] = useState(false)

  const [imageLoading, setImageLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false)
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

  useEffect(() => {
    scrollToBottom()
  }, [chatLog])

  useEffect(() => {
    if (!message?.userId) return
    socket.emit('joinUserRoom', message?.userId)

    return () => {
      socket.emit('leaveTask', message?.userId)
    }
  }, [message?.userId])

  // get specific chat messages
  useEffect(() => {
    if (message?.userId && token) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(
            `http://localhost:3300/api/messages/${message.userId}`,
            {
              headers: { Authorization: token },
            }
          )

          const normalized = res.data.map((msg) => ({
            ...msg,
            from:
              msg.sender === message.userId ||
              msg.sender?._id === message.userId
                ? 'them'
                : 'you',
            type: msg.image || msg.imageUrl ? 'image' : 'text',
            text: msg.content || msg.text || '',
            imageUrl: msg.image || msg.imageUrl || null,
          }))
          setChatLog(normalized)
        } catch (err) {
          console.error('Failed to fetch chat history:', err)
        }
      }

      fetchMessages()
    }
  }, [message?.userId, token])

  useEffect(() => {
    const handleReceive = (msg) => {
      const normalized = {
        ...msg,
        from:
          msg.sender === message.userId || msg.sender?._id === message.userId
            ? 'them'
            : 'you',
        type: msg.image || msg.imageUrl ? 'image' : 'text',
        text: msg.content || msg.text || '',
        imageUrl: msg.image || msg.imageUrl || null,
      }

      setChatLog((prev) => [...prev, normalized])
    }

    socket.on('receiveMessage', handleReceive)
    return () => socket.off('receiveMessage', handleReceive)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    const trimmed = inputValue.trim()
    if (!trimmed && !imageFile) return

    const formData = new FormData()
    formData.append('receiverId', message.userId)
    if (trimmed) formData.append('text', trimmed)
    if (imageFile) formData.append('image', imageFile)

    setSending(true)
    if (imageFile) setImageLoading(true)

    try {
      const response = await axios.post(
        'http://localhost:3300/api/messages',
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.status === 200 || response.status === 201) {
        const msg = response.data

        setInputValue('')
        setImageFile(null)
      }
    } catch (err) {
      console.error('Send message failed:', err)
    } finally {
      setSending(false)
      setImageLoading(false)
    }
  }

  const onEmojiClick = (emojiData) => {
    setInputValue((prev) => prev + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header - stays fixed at top */}
      <div className="flex items-center p-4 border-b dark:border-gray-700">
        <Avatar name={message.name} profilePhoto={message.profilePhoto} />
        <div className="flex-1 ml-3 font-semibold dark:text-white">
          {message.name}
        </div>
        <button
          onClick={closeChat}
          className="text-sm text-white bg-[#1A3D8F] px-4 py-1 rounded-lg"
        >
          Close
        </button>
      </div>

      {/* Chat log container - scrolls when needed */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: isDarkMode ? '#2e2e2e' : '#f0f0f0',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: isDarkMode ? '#555' : '#c1c1c1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: isDarkMode ? '#888' : '#a0a0a0',
          },
          scrollbarWidth: 'thin',
          scrollbarColor: isDarkMode ? '#555 #2e2e2e' : '#c1c1c1 #f0f0f0',
        }}
      >
        {chatLog.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.from === 'you' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                msg.from === 'you'
                  ? 'bg-[#1A3D8F] text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white rounded-bl-none'
              }`}
            >
              {msg.type === 'image' ? (
                <img
                  src={msg.imageUrl}
                  className="rounded-md max-w-full h-auto"
                />
              ) : (
                <>{msg.text || '[No message content]'}</>
              )}
            </div>
          </div>
        ))}
        {imageLoading && (
          <div className="text-xs text-gray-400">Uploading image...</div>
        )}
        {(sending || imageLoading) && <Loader />}

        <div ref={messagesEndRef} />
      </div>

      {imageFile && (
        <div className="p-2 flex items-center gap-2">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            className="w-24 h-auto rounded-md border"
          />
          <button
            onClick={() => setImageFile(null)}
            className="text-red-500 text-xs"
          >
            Remove
          </button>
        </div>
      )}

      {/* Input Section with Loader Overlay */}
      <div className="relative p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
        <div
          className={`relative flex items-center rounded-full border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 ${
            sending || imageLoading ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          {/* Emoji Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white focus:outline-none"
          >
            <Smile size={20} />
          </button>

          {/* Image Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="ml-3 text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white focus:outline-none"
          >
            <ImageIcon size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Text Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 mx-4 bg-transparent outline-none text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-white focus:outline-none"
          >
            <SendHorizonal size={20} />
          </button>
        </div>

        {/* Animated Loader Overlay */}
        {(sending || imageLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-lg z-10">
            <div className="flex items-center space-x-2">
              <Loader size="20" />
              <span className="text-sm text-gray-700 dark:text-gray-200">
                {imageLoading ? 'Uploading image...' : 'Sending message...'}
              </span>
            </div>
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-16 left-6 z-50 shadow-lg"
          >
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
    </div>
  )
}
