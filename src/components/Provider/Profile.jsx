import React from 'react'
import Header from './Header'

const TaskerProfileCard = () => {
  // Simulated API response (replace with actual prop or fetch later)
  const user = {
    name: 'Mohit Kumar',
    email: 'mohit@gmail.com',
    profilePhoto:
      'https://res.cloudinary.com/dbfzfqfhl/image/upload/v1745928913/connectMyTask/user-profiles/h3ermpip2dqrxqjphu1x.jpg',
    location: {
      suburb: 'Prospect',
      city: 'Adelaide',
      state: 'SA',
    },
    skills: ['Cleaning'],
    isVerified: false,
    averageRating: 0,
    totalReviews: 0,
    createdAt: '2025-04-29T12:15:13.540Z',
    updatedAt: '2025-04-29T12:15:13.540Z',
    role: 'provider',
  }

  return (
    <>
      <Header />
      <div className="flex items-center justify-center bg-gray-100 p-6">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 transition transform hover:scale-[1.015] duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase text-blue-400 font-semibold tracking-wide">
                Meet
              </p>
              <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-sm text-gray-500">
                  Online less than a day ago
                </p>
              </div>
            </div>
            <img
              src={user.profilePhoto}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-md"
            />
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mt-5 text-gray-600 text-sm font-medium">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 4.25 7 13 7 13s7-8.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span>
              {user.location.suburb}, {user.location.city} {user.location.state}
              , Australia
            </span>
          </div>

          {/* Stats */}
          <div className="mt-6 bg-gray-50 rounded-xl p-5 flex justify-between items-center">
            {/* Rating */}
            <div className="text-center w-1/2">
              <p className="text-2xl font-semibold text-yellow-500">
                {user.averageRating.toFixed(1)}{' '}
                <span className="text-yellow-400">★</span>
              </p>
              <p className="text-gray-600 text-sm mt-1">Overall Rating</p>
              <p className="text-xs text-blue-600 underline mt-0.5">
                {user.totalReviews} reviews
              </p>
            </div>

            <div className="w-px h-10 bg-gray-300 mx-4" />

            {/* Role & Verification */}
            <div className="text-center w-1/2">
              <p
                className={`text-sm font-semibold ${
                  user.isVerified ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {user.isVerified ? 'Verified' : 'Not Verified'}
              </p>
              <p className="text-gray-600 text-sm mt-1">Role: {user.role}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Email: {user.email}
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-5">
            <p className="text-sm text-gray-500 mb-2 font-medium">Skills</p>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Created At */}
          <div className="mt-6 text-xs text-gray-400">
            <p>Joined: {new Date(user.createdAt).toDateString()}</p>
          </div>

          {/* Update Profile Button */}
          <div className="mt-6">
            <button
              onClick={() => alert('Redirect to Update Profile Form')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default TaskerProfileCard
