import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Provider/Header'
import step1 from '../assets/features.svg'
import step2 from '../assets/testimonial.svg'
import step3 from '../assets/success.svg'
import testimonial from '../assets/testimonial.svg'

export default function ProviderHomePage() {
  const navigate = useNavigate()

  const providerName =
    JSON.parse(localStorage.getItem('provider')).name || 'Provider'

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-[#214296] mb-2">
            Welcome back, {providerName}!
          </h1>
          <p className="text-lg text-[#555] max-w-2xl mx-auto mb-8">
            ConnectMyTask helps you grow your freelance business by finding new
            work, managing offers, and communicating with clients.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <button
              className="bg-[#01A647] hover:bg-[#019a3f] text-white text-base px-6 py-3 rounded-full shadow-md"
              onClick={() => navigate('/provider/tasks')}
            >
              Browse Tasks
            </button>
            <button
              variant="outline"
              className="text-[#214296] border-[#214296] text-base px-6 py-3 rounded-full hover:bg-[#edf1fc]"
              onClick={() => navigate('/provider/profile')}
            >
              View Profile
            </button>
          </div>
        </motion.div>

        <section className="mt-16 grid gap-8 md:grid-cols-3 text-center">
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <img src={step1} alt="Tasks" className="mx-auto w-14 h-14 mb-4" />
            <h3 className="text-xl font-semibold text-[#214296] mb-2">
              Find Tasks
            </h3>
            <p className="text-[#666] text-sm">
              Browse nearby tasks that match your skills and availability.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <img
              src={step2}
              alt="Make Offer"
              className="mx-auto w-14 h-14 mb-4"
            />
            <h3 className="text-xl font-semibold text-[#214296] mb-2">
              Make Offers
            </h3>
            <p className="text-[#666] text-sm">
              Send offers and get hired fast with real-time messaging.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <img
              src={step3}
              alt="Manage Work"
              className="mx-auto w-14 h-14 mb-4"
            />
            <h3 className="text-xl font-semibold text-[#214296] mb-2">
              Manage Your Work
            </h3>
            <p className="text-[#666] text-sm">
              Track progress, messages, and earnings in one place.
            </p>
          </div>
        </section>

        <section className="mt-20 bg-white rounded-2xl shadow-md p-8 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#214296] mb-4">
            Why Providers Love ConnectMyTask
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-[#555]">
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

        <section className="mt-20 text-center">
          <h2 className="text-xl font-semibold text-[#01A647] mb-2">
            Join thousands of providers already earning with ConnectMyTask
          </h2>
          <button
            className="mt-4 bg-[#214296] text-white px-8 py-3 rounded-full text-lg hover:bg-[#1a3277]"
            onClick={() => navigate('/provider/tasks')}
          >
            Get Started Now
          </button>
        </section>
      </main>
    </div>
  )
}
