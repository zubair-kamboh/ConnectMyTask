'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  })
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in and redirect to the respective dashboard
    const user = localStorage.getItem('user')
    if (user) {
      const parsedUser = JSON.parse(user)
      if (parsedUser.role === 'user') {
        router.push('/user/dashboard')
      } else if (parsedUser.role === 'provider') {
        router.push('/provider/dashboard')
      }
    }
  }, [router])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords don't match. Please try again.")
      return
    }

    // Make the POST request to the backend
    try {
      const response = await fetch('http://localhost:3300/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('User Registered Successfully!')
        router.push('/login')
      } else {
        toast.error(data.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('There was an error with the registration. Please try again.')
    }
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md shadow-xl p-8 bg-white rounded-2xl">
          <h2 className="text-center text-2xl font-bold text-blue-600">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Role Selection */}
            <div className="w-full">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="provider">Provider</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
