import React, { useState } from 'react'
import { motion } from 'framer-motion'
import EditProfileModal from './EditProfileModal'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Avatar from './Avatar'

export default function ProfilePage({ profile, onEdit }) {
  const [isEditOpen, setEditOpen] = useState(false)
  const [updatedProfile, setUpdatedProfile] = useState(profile)

  const handleEdit = (newData) => {
    setUpdatedProfile(newData)
    if (onEdit) onEdit(newData)
  }

  if (!profile) return null

  return (
    <div className="flex items-center justify-center bg-gray-100 dark:bg-[#121212] py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl p-8 sm:p-10 transition transform hover:scale-[1.015]"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase text-blue-500 font-semibold tracking-wide">
              User Profile
            </p>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {profile.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {profile.email}
            </p>
            {profile.location?.address && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                <LocationOnIcon fontSize="small" className="mr-1" />
                {profile.location.address}
              </div>
            )}
          </div>
          <Avatar
            name={profile.name}
            profilePhoto={profile.profilePhoto}
            size="xl"
            className="border-4 border-blue-500 shadow-md"
          />
        </div>

        {/* Stats */}
        <div className="mt-6 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl p-5 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-yellow-500">
              {profile.averageRating.toFixed(1)} ★
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Rating
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 underline mt-0.5">
              {profile.totalReviews} Reviews
            </p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600 dark:text-green-300">
              {profile.completedTasks}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tasks Completed
            </p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-700 dark:text-green-400">
              {profile.recommendations}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Recommendations
            </p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-300">
              {profile.rank}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rank</p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="mt-6 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl p-5 flex justify-between items-center">
          <div className="text-center w-1/2">
            <p
              className={`text-sm font-semibold ${
                profile.isVerified ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {profile.isVerified ? 'Verified' : 'Not Verified'}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Role: {profile.role}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              ID: {profile._id.slice(0, 8)}...
            </p>
          </div>
          <div className="w-px h-10 bg-gray-300 dark:bg-gray-600 mx-4" />
          <div className="text-center w-1/2">
            <p className="text-sm font-semibold text-blue-500">Joined</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
            Skills
          </p>
          {profile.skills && profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No skills added</p>
          )}
        </div>

        {/* Edit Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setEditOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium shadow-lg transition"
          >
            Edit Profile
          </button>
        </div>

        {/* Edit Modal */}
        <EditProfileModal
          open={isEditOpen}
          onClose={() => setEditOpen(false)}
          profile={profile}
          onSave={handleEdit}
        />
      </motion.div>
    </div>
  )
}
