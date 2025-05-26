import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiUsers,
  FiBriefcase,
  FiEdit2,
  FiBarChart2,
  FiSettings,
} from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import AdminLayout from '../../components/AdminLayout'

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState('Admin')
  const { t } = useTranslation()

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem('admin'))
    setAdminName(storedAdmin?.name || 'Admin')
  }, [])

  const cards = [
    {
      icon: <FiUsers className="text-3xl text-indigo-500" />,
      title: 'Manage Users',
      to: '/admin/users',
      description: 'View, edit, and manage all registered users.',
    },
    {
      icon: <FiBriefcase className="text-3xl text-emerald-500" />,
      title: 'Manage Providers',
      to: '/admin/providers',
      description: 'Oversee service providers and their profiles.',
    },
    {
      icon: <FiEdit2 className="text-3xl text-sky-500" />,
      title: 'Manage Tasks',
      to: '/admin/tasks',
      description: 'Review posted tasks and moderate content.',
    },
    {
      icon: <FiBarChart2 className="text-3xl text-yellow-500" />,
      title: 'Analytics',
      to: '/admin/dashboard/analytics',
      description: 'Analyze platform usage and performance metrics.',
    },
    {
      icon: <FiSettings className="text-3xl text-gray-500" />,
      title: 'System Settings',
      to: '/admin/settings',
      description: 'Configure system preferences and roles.',
    },
  ]

  return (
    <div className="w-full h-screen overflow-hidden px-8 py-12 bg-white text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold text-indigo-600">
          Welcome back, {adminName}
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Here’s your admin control center.
        </p>
      </motion.div>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {cards.map(({ icon, title, to, description }, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300"
          >
            <NavLink to={to} className="block h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-50 rounded-full">{icon}</div>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              </div>
              <p className="text-sm text-gray-600">{description}</p>
            </NavLink>
          </motion.div>
        ))}
      </section>
    </div>
  )
}
