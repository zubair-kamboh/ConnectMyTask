import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Provider/Header'
import step1 from '../assets/features.svg'
import step2 from '../assets/testimonial.svg'
import step3 from '../assets/success.svg'

export default function ProviderHomePage() {
  const navigate = useNavigate()

  const providerName =
    JSON.parse(localStorage.getItem('provider'))?.name || 'Provider'

  return (
    <div className="bg-[#F9FAFB] dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-[#214296] dark:text-white mb-2">
            Welcome back, {providerName}!
          </h1>
          <p className="text-lg text-[#555] dark:text-gray-300 max-w-2xl mx-auto mb-8">
            ConnectMyTask helps you grow your freelance business by finding new
            work, managing offers, and communicating with clients.
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              className="bg-[#01A647] hover:bg-[#019a3f] text-white text-base px-6 py-3 rounded-full shadow-md"
              onClick={() => navigate('/provider/tasks')}
            >
              Browse Tasks
            </button>
            <button
              className="text-[#214296] dark:text-white border border-[#214296] dark:border-white text-base px-6 py-3 rounded-full hover:bg-[#edf1fc] dark:hover:bg-white/10 transition"
              onClick={() => navigate('/provider/profile')}
            >
              View Profile
            </button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <section className="mt-16 grid gap-8 md:grid-cols-3 text-center">
          {[
            {
              icon: step1,
              title: 'Find Tasks',
              desc: 'Browse nearby tasks that match your skills and availability.',
            },
            {
              icon: step2,
              title: 'Make Offers',
              desc: 'Send offers and get hired fast with real-time messaging.',
            },
            {
              icon: step3,
              title: 'Manage Your Work',
              desc: 'Track progress, messages, and earnings in one place.',
            },
          ].map((step, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 hover:shadow-lg transition"
            >
              <img
                src={step.icon}
                alt={step.title}
                className="mx-auto w-14 h-14 mb-4"
              />
              <h3 className="text-xl font-semibold text-[#214296] dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-[#666] dark:text-gray-300 text-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Testimonials */}
        <section className="mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#214296] dark:text-white mb-4">
            Why Providers Love ConnectMyTask
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-[#555] dark:text-gray-300">
            <div>
              <p className="italic">
                “ConnectMyTask made it easy for me to find reliable work every
                week. The offers and chat features save me time.”
              </p>
              <p className="font-semibold mt-2">– Jamie D., Electrician</p>
            </div>
            <div>
              <p className="italic">
                “I love the map view. I can quickly see what’s available near me
                and plan my week better.”
              </p>
              <p className="font-semibold mt-2">– Priya M., Cleaner</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <h2 className="text-xl font-semibold text-[#01A647] dark:text-green-400 mb-2">
            Join thousands of providers already earning with ConnectMyTask
          </h2>
          <button
            className="mt-4 bg-[#214296] hover:bg-[#1a3277] text-white px-8 py-3 rounded-full text-lg transition"
            onClick={() => navigate('/provider/tasks')}
          >
            Get Started Now
          </button>
        </section>
      </main>
    </div>
  )
}
