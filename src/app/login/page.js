'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
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

    // Make API call to authenticate user
    try {
      const response = await fetch('http://localhost:3300/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Save token and user data to localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Show success message
        toast.success('Login successful!')

        // Redirect based on user role
        if (data.user.role === 'user') {
          router.push('/user/dashboard')
        } else if (data.user.role === 'provider') {
          router.push('/provider/dashboard')
        }
      } else {
        // Handle login failure
        toast.error(data.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('There was an error during login. Please try again.')
    }
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md shadow-lg p-6 bg-white rounded-2xl">
          <h2 className="text-center text-black text-xl font-bold">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full text-black p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full text-black p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Login
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-black">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-500">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
