'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [bids, setBids] = useState([])
  const [messages, setMessages] = useState([])
  const [notifications, setNotifications] = useState([])
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem('user')

    setUser(JSON.parse(currentUser)) // Replace with real data fetching from API
    setTasks([
      {
        id: 1,
        title: 'Fix the website layout',
        description: 'Redesign homepage',
        deadline: '2025-04-10',
        budget: '$500',
        status: 'Posted',
      },
      {
        id: 2,
        title: 'SEO optimization',
        description: 'Improve website SEO',
        deadline: '2025-04-15',
        budget: '$300',
        status: 'Assigned',
      },
    ])
    setBids([
      {
        id: 1,
        taskId: 1,
        provider: 'John Doe',
        bid: '$450',
        status: 'Pending',
      },
      {
        id: 2,
        taskId: 2,
        provider: 'Jane Smith',
        bid: '$250',
        status: 'Accepted',
      },
    ])
    setMessages([
      {
        from: 'Jane Smith',
        message: 'I can help with the SEO optimization task.',
      },
      {
        from: 'John Doe',
        message: 'I have sent my bid for the website redesign.',
      },
    ])
    setNotifications([
      {
        id: 1,
        message: "Your task 'Fix the website layout' has received a bid.",
      },
      { id: 2, message: 'Jane Smith accepted your SEO task.' },
    ])
    // }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white min-h-screen">
        <div className="p-6 text-xl font-bold">Dashboard</div>
        <ul className="space-y-4 mt-6">
          <li>
            <Link
              href="/user/profile"
              className="block px-6 py-2 hover:bg-gray-700"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link href="/tasks" className="block px-6 py-2 hover:bg-gray-700">
              Post Task
            </Link>
          </li>
          <li>
            <Link href="/bids" className="block px-6 py-2 hover:bg-gray-700">
              Bids
            </Link>
          </li>
          <li>
            <Link
              href="/messages"
              className="block px-6 py-2 hover:bg-gray-700"
            >
              Messages
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="block px-6 py-2 w-full text-left hover:bg-gray-700"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to Your Dashboard
        </h1>

        {user ? (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-600">
              Hello, {user.name}!
            </h2>
            <p className="mt-2 text-gray-600">Email: {user.email}</p>
            <p className="mt-2 text-gray-600">Role: {user.role}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        {/* Task Management Section */}
        <section className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800">Your Tasks</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="p-6 bg-white shadow-lg rounded-lg">
                <h4 className="font-semibold text-xl text-gray-600">
                  {task.title}
                </h4>
                <p className="mt-2 text-gray-500">{task.description}</p>
                <p className="mt-4 text-gray-600">Deadline: {task.deadline}</p>
                <p className="text-gray-600">Budget: {task.budget}</p>
                <p className="mt-4 text-sm text-gray-500">
                  Status: {task.status}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bidding Section */}
        <section className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800">Your Bids</h3>
          <div className="mt-4">
            {bids.map((bid) => (
              <div
                key={bid.id}
                className="p-4 mb-4 bg-white shadow-lg rounded-lg"
              >
                <h4 className="font-semibold text-gray-600">
                  {bid.provider} - Task {bid.taskId}
                </h4>
                <p className="text-gray-500">Bid: {bid.bid}</p>
                <p className="text-gray-500">Status: {bid.status}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Messages Section */}
        <section className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800">Messages</h3>
          <div className="mt-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className="p-4 mb-4 bg-white shadow-lg rounded-lg text-gray-600"
              >
                <strong>{msg.from}</strong>
                <p>{msg.message}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Notifications Section */}
        <section className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800">Notifications</h3>
          <div className="mt-4">
            {notifications.map((notif, index) => (
              <div
                key={index}
                className="p-4 mb-4 bg-white shadow-lg rounded-lg text-gray-600"
              >
                <p>{notif.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
