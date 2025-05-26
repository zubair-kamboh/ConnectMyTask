import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const { loginUser, loginProvider, loginAdmin } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        const { token, user } = data

        if (user.role === 'provider') {
          loginProvider(user, token)
          toast.success('Provider Login Successful!')
          navigate('/provider/home')
        } else if (user.role === 'user') {
          loginUser(user, token)
          toast.success('User Login Successful!')
          navigate('/user/dashboard')
        } else {
          loginAdmin(user, token)
          toast.success('Admin Login Successful!')
          navigate('/admin/dashboard')
        }
      } else {
        toast.error(data.msg || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Server error, try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-[#E0E0E0] mt-10 mb-10">
          <h2 className="text-3xl font-bold text-center text-[#1A3D8F]">
            Welcome Back
          </h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block mb-1 font-medium text-[#666666]"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] text-[#666666]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-[#666666]"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] text-[#666666]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A3D8F] hover:bg-[#163373] text-white py-2 rounded-md font-medium transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-center text-sm text-[#999999]">
              Don’t have an account?{' '}
              <NavLink
                to="/register"
                className="text-[#1A3D8F] hover:underline font-medium"
              >
                Register
              </NavLink>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
