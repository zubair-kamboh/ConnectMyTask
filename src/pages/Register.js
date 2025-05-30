import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import Select from 'react-select'
import Flag from 'react-world-flags'
import geoCodeLocation from '../util/geoCodeLocations'
import { countryOptions } from '../util/countryOptions'
import CountrySelect from '../components/CountrySelect'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    skills: [],
    profilePhoto: null,
    location: {
      country: 'AU',
      lat: '-24.7761086',
      lng: '134.755',
    },
  })

  const [skillInput, setSkillInput] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e) => {
    if (e.target.files?.[0]) {
      setForm((prev) => ({ ...prev, profilePhoto: e.target.files[0] }))
    }
  }

  const handleSkillAdd = () => {
    if (skillInput && !form.skills.includes(skillInput)) {
      setForm((prev) => ({ ...prev, skills: [...prev.skills, skillInput] }))
      setSkillInput('')
    }
  }

  const handleSkillDelete = (skillToRemove) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('email', form.email)
    formData.append('password', form.password)
    formData.append('role', form.role)
    formData.append('location', JSON.stringify(form.location))
    if (form.profilePhoto) formData.append('profilePhoto', form.profilePhoto)
    if (form.role === 'provider') {
      formData.append('skills', form.skills.join(','))
    }

    try {
      const res = await fetch(
        'https://api.connectmytask.xyz/api/auth/register',
        {
          method: 'POST',
          body: formData,
        }
      )
      const data = await res.json()
      if (res.ok) {
        toast.success('Registered successfully!')
        navigate('/login')
      } else {
        toast.error(data.msg || 'Registration failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Server error, try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleCountryChange = async (selectedOption) => {
    const countryCode = selectedOption.value

    const coordinates = await geoCodeLocation(countryCode, '', '')

    if (coordinates) {
      const [lat, lng] = coordinates
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          country: selectedOption.value,
          lat: lat,
          lng: lng,
        },
      }))
    } else {
      toast.error('Could not retrieve coordinates for the selected country')
    }
  }
  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md border border-[#E0E0E0] mt-10 mb-10">
          <h2 className="text-3xl font-bold text-center text-[#1A3D8F]">
            Create Your Account
          </h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block mb-1 font-medium text-[#666666]">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] text-[#666666]"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-[#666666]">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] text-[#666666]"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-[#666666]">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] text-[#666666]"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-[#666666]">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] text-[#666666]"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-[#666666]">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E0E0E0] rounded-md bg-white text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#1A3D8F]"
              >
                <option value="user">User</option>
                <option value="provider">Provider</option>
              </select>
            </div>

            {form.role === 'provider' && (
              <div>
                <label className="block mb-1 font-medium text-[#666666]">
                  Add Skill
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      (e.preventDefault(), handleSkillAdd())
                    }
                    className="flex-grow px-4 py-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D8F]"
                  />
                  <button
                    type="button"
                    onClick={handleSkillAdd}
                    className="px-4 py-2 bg-[#1A3D8F] text-white rounded-md hover:bg-[#163373]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-[#2EC4B6] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillDelete(skill)}
                        className="ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block mb-1 font-medium text-[#666666]">
                Country
              </label>
              <CountrySelect
                isDarkMode={false}
                defaultValue={form.location.country}
                onCountryChange={(location) =>
                  setForm((prev) => ({
                    ...prev,
                    location: { ...prev.location, ...location },
                  }))
                }
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-[#666666]">
                Profile Photo
              </label>
              <input
                type="file"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#1A3D8F] file:text-white
                  hover:file:bg-[#163373]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A3D8F] hover:bg-[#163373] text-white py-2 rounded-md font-medium transition disabled:opacity-60"
            >
              Register
            </button>

            <p className="text-center text-sm text-[#999999]">
              Already have an account?{' '}
              <NavLink
                to="/login"
                className="text-[#1A3D8F] hover:underline font-medium"
              >
                Login
              </NavLink>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
