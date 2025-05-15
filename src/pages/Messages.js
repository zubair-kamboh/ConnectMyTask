import { useEffect, useRef, useState } from 'react'
import { SendHorizonal, Smile, Image as ImageIcon } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import Header from '../components/Provider/Header'
import Loader from '../components/Loader'
import { formatDistanceToNow } from 'date-fns'
import Layout from '../components/Layout'
import { socket } from '../socket'

const Avatar = ({ name }) => {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
  return (
    <div className="w-10 h-10 rounded-full bg-[#E0E0E0] text-[#1A3D8F] font-bold flex items-center justify-center text-sm">
      {initials}
    </div>
  )
}

// Message Card component for listing conversations
const MessageCard = ({ message, onClick }) => (
  <div
    className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-transform hover:scale-[1.02] mb-4"
    onClick={onClick}
  >
    <Avatar name={message.sender.name} />
    <div className="flex-1 ml-4">
      <div className="font-semibold text-[#1A3D8F]">{message.sender.name}</div>
      <div className="text-sm text-[#999999]">
        {message.preview || 'No preview available'}
      </div>
      <div className="text-xs text-[#666666]">
        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
      </div>
    </div>
  </div>
)

const ChatPanel = ({ message, closeChat, onSend }) => {
  const [inputValue, setInputValue] = useState('')
  const [chatLog, setChatLog] = useState([
    { from: 'them', type: 'text', text: message.content },
  ])
  const [typing, setTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [chatLog])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage = { from: 'you', type: 'text', text: inputValue.trim() }
    setChatLog((prev) => [...prev, newMessage])
    onSend(newMessage.text)
    setInputValue('')
    setTyping(false)

    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        {
          from: 'them',
          type: 'text',
          text: 'Got it! Will get back to you soon 😊',
        },
      ])
    }, 2000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend()
    else setTyping(true)
  }

  const onEmojiClick = (emojiData) => {
    setInputValue((prev) => prev + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed!')
      return
    }

    const imageUrl = URL.createObjectURL(file)
    setImageLoading(true)

    const imageMessage = {
      from: 'you',
      type: 'image',
      imageUrl,
    }

    setChatLog((prev) => [...prev, imageMessage])

    setTimeout(() => {
      setImageLoading(false)
      setChatLog((prev) => [
        ...prev,
        { from: 'them', type: 'text', text: 'Nice image! 📸' },
      ])
    }, 1500)
  }

  return (
    <div className="flex flex-col flex-1 bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
        <Avatar name={message.sender.name} />
        <div className="flex-1">
          <div className="font-semibold text-[#1A3D8F]">
            {message.sender.name}
          </div>
          {typing && <div className="text-xs text-gray-500">Typing...</div>}
        </div>
        <button
          onClick={closeChat}
          className="bg-[#1A3D8F] text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2 bg-[#F9FAFB]">
        {chatLog.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.from === 'you' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                msg.from === 'you'
                  ? 'bg-[#1A3D8F] text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              {msg.type === 'image' ? (
                <img
                  src={msg.imageUrl}
                  alt="Uploaded"
                  className="rounded-md max-w-full h-auto"
                  onLoad={() => scrollToBottom()}
                />
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {imageLoading && (
          <div className="text-sm text-gray-500 text-right pr-4">
            Uploading image...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="relative p-4 border-t border-gray-200 bg-white">
        <div className="relative">
          <input
            type="text"
            className="w-full p-3 pl-20 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1A3D8F]"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => setTyping(true)}
          />

          {/* Emoji Button */}
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1A3D8F]"
            title="Emoji"
          >
            <Smile size={20} />
          </button>

          {/* Image Upload Button */}
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute left-10 top-1/2 transform -translate-y-1/2 text-[#1A3D8F]"
            title="Upload image"
          >
            <ImageIcon size={20} />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#1A3D8F]"
          >
            <SendHorizonal size={20} />
          </button>
        </div>

        {/* Emoji Picker Dropdown */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 z-50">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function Messages() {
  const [messages, setMessages] = useState([
    {
      sender: { name: 'John Doe', avatar: '' },
      preview: 'Hey, I need help with a task.',
      createdAt: new Date().toISOString(),
      content: 'Sure, I can help! When do you need it done?',
    },
    {
      sender: { name: 'Jane Smith', avatar: '' },
      preview: 'Can you provide more details?',
      createdAt: new Date().toISOString(),
      content: 'Sure, I need a task done for this weekend!',
    },
  ])
  const [loading, setLoading] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const userData = localStorage.getItem('user')
  const providerData = localStorage.getItem('provider')

  const role = providerData
    ? JSON.parse(providerData).role
    : userData
    ? JSON.parse(userData).role
    : null

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleMessageClick = (message) => {
    setSelectedMessage(message)
  }

  const closeChat = () => {
    setSelectedMessage(null)
  }

  if (role === 'user') {
    return (
      <Layout>
        <div className="flex flex-col h-[85vh] max-h-[85vh]">
          {loading ? (
            <Loader fullScreen />
          ) : (
            <div className="flex flex-1 w-full max-w-7xl mx-auto min-h-0 h-full">
              {/* Left Sidebar for Conversations */}
              <div className="w-1/3 bg-white shadow-md rounded-lg p-4 space-y-4 overflow-y-auto">
                <div className="font-semibold text-[#1A3D8F] text-lg">
                  Messages
                </div>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <MessageCard
                      key={index}
                      message={message}
                      onClick={() => handleMessageClick(message)}
                    />
                  ))}
                </div>
              </div>

              {/* Right Panel for Chat */}
              <div className="flex flex-col flex-1 bg-white shadow-md rounded-lg overflow-hidden min-h-0">
                {selectedMessage ? (
                  <ChatPanel
                    message={selectedMessage}
                    closeChat={closeChat}
                    onSend={(newMessage) => {
                      console.log('User sent:', newMessage)
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-400 flex items-center justify-center flex-1">
                    Select a message to chat
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Layout>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {role === 'provider' && <Header />}
      {loading ? (
        <Loader fullScreen />
      ) : (
        <div className="flex flex-1 w-full max-w-7xl mx-auto min-h-0">
          {/* Left Sidebar for Conversations */}
          <div className="w-1/3 bg-white shadow-md rounded-lg p-4 space-y-4 overflow-y-auto">
            <div className="font-semibold text-[#1A3D8F] text-lg">Messages</div>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <MessageCard
                  key={index}
                  message={message}
                  onClick={() => handleMessageClick(message)}
                />
              ))}
            </div>
          </div>

          {/* Right Panel for Chat */}
          <div className="flex flex-col flex-1 bg-white shadow-md rounded-lg overflow-hidden min-h-0">
            {selectedMessage ? (
              <ChatPanel
                message={selectedMessage}
                closeChat={closeChat}
                onSend={(newMessage) => {
                  console.log('User sent:', newMessage)
                }}
              />
            ) : (
              <div className="text-center text-gray-400 flex items-center justify-center flex-1">
                Select a message to chat
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
