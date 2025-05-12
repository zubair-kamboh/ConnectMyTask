import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatModal({ isOpen, onClose, provider }) {
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
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-100">
              <h2 className="text-base font-semibold text-gray-800">
                Chat with {provider?.name || 'Provider'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={16} />
              </button>
            </div>
            <ChatUI />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ChatUI() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'provider', text: 'Hi! I’m ready to start on this task.' },
    { id: 2, from: 'you', text: 'Great! Do you need any materials?' },
  ])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages([...messages, { id: Date.now(), from: 'you', text: input }])
    setInput('')
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
              msg.from === 'you'
                ? 'bg-blue-600 text-white ml-auto'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-3 border-t flex gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}
