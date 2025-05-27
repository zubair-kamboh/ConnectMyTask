import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Loader from '../components/Loader'
import Layout from './Layout'
import { motion } from 'framer-motion'
import Avatar from './Avatar'

const OfferProviderProfile = () => {
  const { providerId } = useParams()
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`/api/auth/profile/${providerId}`, {
          headers: { Authorization: `${token}` },
        })
        setProvider(res.data)
      } catch (err) {
        console.error('Failed to fetch provider:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProvider()
  }, [providerId])

  if (loading) return <Loader />

  return (
    <Layout>
      <div className="flex items-center justify-center bg-gray-100 dark:bg-[#121212] py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl p-8 sm:p-10 transition transform hover:scale-[1.015]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase text-blue-500 font-semibold tracking-wide">
                Meet
              </p>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {provider?.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Online less than a day ago
                </p>
              </div>
            </div>
            <Avatar
              name={provider.name}
              profilePhoto={provider.profilePhoto}
              size="xl"
              className="border-4 border-blue-500 shadow-md"
            />
          </div>

          {/* Stats */}
          <div className="mt-6 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl p-5 flex justify-between items-center">
            <div className="text-center w-1/2">
              <p className="text-2xl font-semibold text-yellow-500">
                {provider?.averageRating.toFixed(1)}{' '}
                <span className="text-yellow-400">★</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Rating
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 underline mt-0.5">
                {provider?.totalReviews} reviews
              </p>
            </div>

            <div className="w-px h-10 bg-gray-300 dark:bg-gray-600 mx-4" />

            <div className="text-center w-1/2">
              <p
                className={`text-sm font-semibold ${
                  provider?.isVerified ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {provider?.isVerified ? 'Verified' : 'Not Verified'}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Role: {provider?.role}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Email: {provider?.email}
              </p>
            </div>
          </div>

          {/* Extra Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 text-center">
            <div className="bg-blue-50 dark:bg-[#1a2b3b] p-4 rounded-xl shadow-sm">
              <p className="text-lg font-bold text-blue-600 dark:text-blue-300">
                {provider?.completedTasks}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tasks Completed
              </p>
            </div>
            <div className="bg-green-50 dark:bg-[#183b2a] p-4 rounded-xl shadow-sm">
              <p className="text-lg font-bold text-green-600 dark:text-green-300">
                {provider?.recommendations}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Recommendations
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-[#3b361a] p-4 rounded-xl shadow-sm col-span-2">
              <p className="text-lg font-bold text-yellow-600 dark:text-yellow-300">
                {provider?.rank}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current Rank
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
              Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {provider?.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Joined */}
          <div className="mt-6 text-xs text-gray-400 dark:text-gray-500">
            <p>Joined: {new Date(provider?.createdAt).toDateString()}</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}

export default OfferProviderProfile
