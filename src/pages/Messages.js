import { useEffect, useState } from 'react'

import Header from '../components/Provider/Header'
import Loader from '../components/Loader'
import Layout from '../components/Layout'
import axios from 'axios'
import ChatPanel from '../components/ChatPanel'
import MessageCard from '../components/MessageCard'
import { useNavigate, useParams } from 'react-router-dom'

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { userId } = useParams()
  const [selectedMessage, setSelectedMessage] = useState(null)
  const userData = localStorage.getItem('user')
  const providerData = localStorage.getItem('provider')
  const userToken = localStorage.getItem('token')
  const providerToken = localStorage.getItem('providerToken')
  const token = userToken ? userToken : providerToken

  const role = providerData
    ? JSON.parse(providerData).role
    : userData
    ? JSON.parse(userData).role
    : null

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)

      try {
        const response = await axios.get(
          'https://api.connectmytask.xyz/api/messages/summary/me',
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )

        setMessages(response.data)
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  useEffect(() => {
    if (userId && messages.length > 0) {
      const foundMessage = messages.find((msg) => msg.userId === userId)
      setSelectedMessage(foundMessage)
    }
  }, [userId, messages])

  const handleMessageClick = (message) => {
    if (userToken) {
      navigate(`/user/messages/${message.userId}`)
    } else {
      navigate(`/provider/messages/${message.userId}`)
    }
  }

  const closeChat = () => {
    setSelectedMessage(null)
    if (userData) {
      navigate('/user/messages')
    } else {
      navigate('/provider/messages')
    }
  }

  const Sidebar = (
    <div className="w-1/3 bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 space-y-4 overflow-y-auto">
      <div className="font-semibold text-[#1A3D8F] dark:text-white text-lg">
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
  )

  const Chat = (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden min-h-0">
      {selectedMessage ? (
        <ChatPanel
          message={selectedMessage}
          closeChat={closeChat}
          token={token}
        />
      ) : (
        <div className="text-center text-gray-400 dark:text-gray-500 flex items-center justify-center flex-1">
          Select a message to chat
        </div>
      )}
    </div>
  )

  if (role === 'user') {
    return (
      <Layout>
        <div className="flex flex-col h-[85vh] max-h-[85vh]">
          {loading ? (
            <Loader fullScreen />
          ) : (
            <div className="flex flex-1 w-full max-w-7xl mx-auto min-h-0 h-full">
              {Sidebar}
              {Chat}
            </div>
          )}
        </div>
      </Layout>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {role === 'provider' && <Header />}

      {loading ? (
        <Loader fullScreen />
      ) : (
        <div className="flex flex-1 w-full max-w-7xl mx-auto min-h-0 gap-6 p-4">
          {/* Sidebar stays as is */}

          {Sidebar}

          {/* Chat container */}
          <div
            className="
            flex-1
            bg-white dark:bg-gray-800 
            rounded-2xl 
            shadow-lg 
            p-6
            overflow-y-auto
            flex
            flex-col
            transition
            duration-300
            "
            style={{ maxHeight: 'calc(100vh - 64px)' }} // optional fixed max height if needed
          >
            {Chat}
          </div>
        </div>
      )}
    </div>
  )
}
