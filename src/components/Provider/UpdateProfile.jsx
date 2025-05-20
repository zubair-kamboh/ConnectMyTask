import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Loader from '../Loader'
import toast from 'react-hot-toast'

const UpdateProfile = ({ user, onClose, onUpdate, loading, setLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    profilePhoto: null,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        skills: user.skills?.join(', ') || '',
        profilePhoto: null,
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilePhoto: file,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('providerToken')
      const providerId = JSON.parse(localStorage.getItem('provider')).id

      const data = new FormData()
      data.append('name', formData.name)
      data.append('skills', formData.skills)
      if (formData.profilePhoto) {
        data.append('profilePhoto', formData.profilePhoto)
      }

      const res = await axios.put(
        `http://localhost:3300/api/auth/profile/${providerId}`,
        data,
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      onUpdate(res.data.user)
      toast.success('Profile updated successfully!')

      onClose()
    } catch (err) {
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader fullScreen />

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-[#1A3D8F] dark:text-[#74a9ff]">
          Update Profile
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="skills"
            type="text"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <label className="block mb-1 font-medium text-[#666666] dark:text-gray-300">
              Profile Photo
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#1A3D8F] file:text-white
                  hover:file:bg-[#163373] cursor-pointer
                  dark:text-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#1A3D8F] hover:bg-[#163373] text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateProfile
