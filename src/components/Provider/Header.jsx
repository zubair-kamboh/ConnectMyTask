import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loader from '../Loader' // Make sure this path matches your structure
import { NavLink, useNavigate } from 'react-router-dom'

const Header = () => {
  const [user, setUser] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('providerToken')
        const providerId = JSON.parse(localStorage.getItem('provider')).id

        const response = await axios.get(
          `http://localhost:3300/api/auth/profile/${providerId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )

        setUser(response.data.user || response.data)
      } catch (error) {
        toast.error('Failed to fetch profile')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen])

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev)
  }

  const handleLogout = () => {
    localStorage.clear()

    window.location.href = '/'
  }

  return (
    <header className="bg-white shadow px-6 md:px-10 py-6 border-b">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <NavLink
            to={'/provider/tasks'}
            className="text-3xl md:text-4xl font-extrabold text-[#1A3D8F] tracking-tight"
          >
            Connectmytask
          </NavLink>
          <button className="bg-[#1A3D8F] hover:bg-[#163373] text-white text-lg font-semibold rounded-full px-6 py-3 shadow transition">
            Post a task
          </button>
          <nav className="flex flex-wrap items-center space-x-4 text-[#1A3D8F] text-lg font-medium">
            <a href="#" className="hover:underline">
              Browse tasks
            </a>
            <a href="#" className="hover:underline">
              My tasks
            </a>
            <a href="#" className="hover:underline">
              List my services
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-4 text-[#1A3D8F] text-lg font-medium">
          <a href="#" className="hover:underline">
            Help
          </a>
          <a href="#" className="hover:underline">
            Notifications
          </a>
          <a href="#" className="hover:underline">
            Messages
          </a>

          {loading ? (
            <Loader size="small" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#1A3D8F] flex items-center justify-center"
              >
                <img
                  src={user.profilePhoto || '/default-avatar.png'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <NavLink
                    to="/provider/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-[#1A3D8F] hover:text-white"
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-[#1A3D8F] hover:text-white"
                  >
                    Logout
                  </NavLink>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Header
