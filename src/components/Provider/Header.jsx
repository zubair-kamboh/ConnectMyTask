import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loader from '../Loader' // Make sure this path matches your structure
import { NavLink, useNavigate } from 'react-router-dom'
import { useDarkMode } from '../../context/ThemeContext'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../Avatar'

const Header = () => {
  const [user, setUser] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef(null)
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { logout } = useAuth()

  const navigate = useNavigate()
  const token = localStorage.getItem('providerToken')
  const providerId = JSON.parse(localStorage.getItem('provider')).id

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)
      try {
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
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white dark:bg-[#0F1B47] dark:text-white shadow-md px-6 md:px-10 py-4 border-b dark:border-[#334466]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/provider/home"
          className="text-3xl font-bold text-[#1A3D8F] dark:text-white"
        >
          Connectmytask
        </NavLink>

        {/* Center Navigation */}
        <nav className="hidden md:flex gap-6 text-base font-medium">
          <NavLink
            to="/provider/tasks"
            className="hover:text-[#1A3D8F] dark:hover:text-blue-300 transition"
          >
            Browse Tasks
          </NavLink>
          <NavLink
            to="#"
            className="hover:text-[#1A3D8F] dark:hover:text-blue-300 transition"
          >
            My Tasks
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <NavLink
            to={`/profile/${providerId}`}
            className="hover:text-[#1A3D8F] dark:hover:text-blue-300 transition text-sm md:text-base"
          >
            Profile
          </NavLink>
          <NavLink
            to="/provider/messages"
            className="hover:text-[#1A3D8F] dark:hover:text-blue-300 transition text-sm md:text-base"
          >
            Messages
          </NavLink>

          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm hidden md:inline">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
            <button
              onClick={toggleDarkMode}
              className={`w-14 h-8 flex items-center rounded-full px-1 transition duration-300 ${
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label="Toggle Dark Mode"
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transform transition-transform duration-300 ${
                  darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {darkMode ? (
                  <LightModeOutlinedIcon
                    fontSize="small"
                    className="text-yellow-400"
                  />
                ) : (
                  <DarkModeOutlinedIcon
                    fontSize="small"
                    className="text-blue-900"
                  />
                )}
              </div>
            </button>
          </div>

          {/* User Avatar */}
          {loading ? (
            <Loader size="small" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="w-10 h-10 rounded-full border-2 border-[#1A3D8F] overflow-hidden"
              >
                <Avatar
                  name={user.name}
                  profilePhoto={user.profilePhoto}
                  size="md"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1A3D8F] border border-gray-200 dark:border-[#334466] rounded-md shadow-lg z-50 overflow-hidden">
                  <NavLink
                    to={`/profile/${providerId}`}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white dark:hover:text-[#1A3D8F] transition"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white dark:hover:text-[#1A3D8F] transition"
                  >
                    Logout
                  </button>
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
