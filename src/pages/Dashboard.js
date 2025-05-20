import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'

import step1 from '../assets/features.svg'
import step2 from '../assets/testimonial.svg'
import step3 from '../assets/success.svg'

export default function UserDashboard() {
  const [userName, setUserName] = useState('User')
  const navigate = useNavigate()

  useEffect(() => {
    const storedName = JSON.parse(localStorage.getItem('user')).name || 'User'
    setUserName(storedName)
  }, [])

  return (
    <Layout>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen px-6 py-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-primary dark:text-white mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            ConnectMyTask helps you post tasks, manage offers, and connect with
            trusted providers to get things done efficiently.
          </p>
        </motion.div>

        {/* Features Section */}
        <section className="grid gap-8 md:grid-cols-3 text-center">
          {[step1, step2, step3].map((img, idx) => {
            const titles = ['Post a Task', 'Track Offers', 'Complete Tasks']
            const descriptions = [
              'Describe your task, set your budget, and let reliable providers come to you.',
              'View and manage provider offers in real-time, with messaging built-in.',
              'Track progress and complete tasks seamlessly while staying in control.',
            ]
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 hover:shadow-lg transition"
              >
                <img
                  src={img}
                  alt={titles[idx]}
                  className="mx-auto w-14 h-14 mb-4"
                />
                <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">
                  {titles[idx]}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {descriptions[idx]}
                </p>
              </div>
            )
          })}
        </section>

        {/* Testimonial Section */}
        <section className="mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">
            Why Users Love ConnectMyTask
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-700 dark:text-gray-300">
            <div>
              <p className="italic">
                “I posted a task and found someone to help within minutes. Super
                convenient!”
              </p>
              <p className="font-semibold mt-2">– Sarah J., Melbourne</p>
            </div>
            <div>
              <p className="italic">
                “The messaging feature and transparent offers made the process
                smooth and safe.”
              </p>
              <p className="font-semibold mt-2">– Daniel K., Sydney</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <h2 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
            Ready to get things done?
          </h2>
          <div className="space-x-4 mt-4">
            <NavLink
              className="bg-green-600 hover:bg-green-700 text-white text-base px-6 py-3 rounded-full shadow-md"
              to="/user/dashboard/tasks"
            >
              Post a Task
            </NavLink>
            <NavLink
              className="text-primary border border-primary px-6 py-3 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition"
              to="/user/messages"
            >
              Messages
            </NavLink>
          </div>
        </section>
      </div>
    </Layout>
  )
}
