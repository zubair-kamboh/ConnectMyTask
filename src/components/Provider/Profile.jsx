import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Header from './Header'
import Loader from '../Loader'
import UpdateProfile from './UpdateProfile'
import Avatar from '../Avatar'
import { useLocation, useParams } from 'react-router-dom'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showUpdate, setShowUpdate] = useState(false)
  const { userId } = useParams()
  const location = useLocation()
  const fromTaskPage = location.state?.fromTaskPage

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('providerToken')
      const loggedInProvider = JSON.parse(localStorage.getItem('provider'))
      const idToFetch = userId || loggedInProvider?.id

      const response = await axios.get(`/api/auth/profile/${idToFetch}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      setUser(response.data)
    } catch (err) {
      console.error('Failed to fetch provider profile:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <Loader />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:bg-gray-900 dark:text-white">
        Failed to load profile.
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6 h-[90vh]">
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-10 transition transform hover:scale-[1.015] duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase text-blue-400 font-semibold tracking-wide">
                Meet
              </p>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {user.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Online less than a day ago
                </p>
              </div>
            </div>

            <Avatar
              name={user.name}
              profilePhoto={user.profilePhoto}
              size="xl"
              className="border-4 border-blue-500 shadow-md"
            />
          </div>
          <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-xl p-5 flex justify-between items-center">
            <div className="text-center w-1/2">
              <p className="text-2xl font-semibold text-yellow-500">
                {user.averageRating?.toFixed(1)}{' '}
                <span className="text-yellow-400">★</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                Overall Rating
              </p>
              <p className="text-xs text-blue-600 underline mt-0.5">
                {user.totalReviews} reviews
              </p>
            </div>

            <div className="w-px h-10 bg-gray-300 dark:bg-gray-500 mx-4" />

            <div className="text-center w-1/2">
              <p
                className={`text-sm font-semibold ${
                  user.isVerified ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {user.isVerified ? 'Verified' : 'Not Verified'}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                Role: {user.role}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">
                Email: {user.email}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">
                Country: {user.location?.country}
              </p>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 flex justify-between">
            <p>Completed Tasks: {user.completedTasks}</p>
            <p>Recommendations: {user.recommendations}</p>
            <p>Rank: {user.rank}</p>
          </div>

          {user.skills?.length > 0 && (
            <div className="mt-5">
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-2 font-medium">
                Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium dark:bg-blue-800 dark:text-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 text-xs text-gray-400">
            <p>Joined: {new Date(user.createdAt).toDateString()}</p>
          </div>

          {!fromTaskPage && (
            <div className="mt-6">
              <button
                onClick={() => setShowUpdate(true)}
                className="w-full bg-[#1A3D8F] hover:bg-[#163373] text-white font-semibold py-2 px-4 rounded-xl transition"
              >
                Update Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {showUpdate && (
        <UpdateProfile
          user={user}
          onClose={() => setShowUpdate(false)}
          onUpdate={(updatedUser) => setUser(updatedUser)}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </>
  )
}

export default Profile
