'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UserProfile() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and retrieve the user data from localStorage
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // If user is not logged in, redirect to login page
      router.push('/login')
    }
  }, [router])

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-4">Your Profile</h1>

      {/* Profile Information */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Personal Information
        </h2>
        <div className="space-y-4">
          <div className="text-gray-600">
            <strong>Name:</strong>{' '}
            <span className="text-gray-600">{user.name}</span>
          </div>
          <div className="text-gray-600">
            <strong>Email:</strong>{' '}
            <span className="text-gray-600">{user.email}</span>
          </div>
          <div className="text-gray-600">
            <strong>Role:</strong>{' '}
            <span className="text-gray-600">{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
