// components/ChatPanel.jsx
import { useEffect, useRef, useState } from 'react'
import { SendHorizonal, Smile, Image as ImageIcon } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import Avatar from './Avatar' // move Avatar to its own file too (optional)
import axios from 'axios'
import { socket } from '../socket'

export default function ChatPanel({ message, closeChat, token }) {
  const [inputValue, setInputValue] = useState('')
  const [chatLog, setChatLog] = useState([])
  const [typing, setTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

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
            type: msg.imageUrl ? 'image' : 'text',
            text: msg.content || msg.text || '', // fallback to `msg.text` or empty string
            imageUrl: msg.imageUrl || null,
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
      const senderId =
        typeof msg.sender === 'object' ? msg.sender._id : msg.sender
      const receiverId =
        typeof msg.receiver === 'object' ? msg.receiver._id : msg.receiver

      console.log(msg)

      const normalized = {
        ...msg,
        from:
          msg.sender === message.userId || msg.sender?._id === message.userId
            ? 'them'
            : 'you',
        type: msg.imageUrl ? 'image' : 'text',
        text: msg.content || msg.text || '', // fallback to `msg.text` or empty string
        imageUrl: msg.imageUrl || null,
      }

      setChatLog((prev) => [...prev, normalized])
    }

    socket.on('receiveMessage', handleReceive)
    return () => socket.off('receiveMessage', handleReceive)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // send messages
  const handleSend = async () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    const formData = new FormData()
    formData.append('receiverId', message.userId)
    formData.append('text', trimmed)
    // if (imageFile) formData.append('image', imageFile)

    try {
      const response = await axios.post(
        'http://localhost:3300/api/messages',
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      )

      if (response.ok) {
        setInputValue('')
      }
    } catch (err) {
      console.error('Send message failed:', err)
    } finally {
      //   setIsSending(false)
    }
  }

  const onEmojiClick = (emojiData) => {
    setInputValue((prev) => prev + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const imageUrl = URL.createObjectURL(file)
    setImageLoading(true)
    setChatLog((prev) => [...prev, { from: 'you', type: 'image', imageUrl }])
    setTimeout(() => {
      setImageLoading(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
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

      {/* Chat Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t dark:border-gray-700 relative">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="w-full rounded-full border dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 pl-12 pr-10 text-sm"
          placeholder="Type a message..."
        />
        <button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
        >
          <Smile size={20} />
        </button>
        <button
          onClick={() => fileInputRef.current.click()}
          className="absolute left-10 top-1/2 transform -translate-y-1/2"
        >
          <ImageIcon size={20} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
        <button
          onClick={handleSend}
          className="absolute right-4 top-1/2 transform -translate-y-1/2"
        >
          <SendHorizonal size={20} />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-14 left-4 z-50">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
    </div>
  )
}
