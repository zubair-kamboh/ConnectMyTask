import { NavLink } from 'react-router-dom'
import logo from '../asset/PNG/connectmytask_logo.png'
import { Box } from '@mui/material'

export default function Navbar() {
  return (
    <nav className="bg-[#1A3D8F] text-white shadow dark:bg-[#0F1B47] dark:text-white  px-6 md:px-10 py-4 border-b dark:border-[#334466]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <NavLink to="/" style={{ display: 'inline-block' }}>
              <img
                src={logo}
                alt="ConnectMyTask Logo"
                style={{ height: '40px', objectFit: 'contain' }}
              />
            </NavLink>
          </Box>
          <div className="space-x-4">
            <NavLink
              to="/"
              className="hover:bg-[#163274] px-4 py-2 rounded transition"
            >
              Home
            </NavLink>
            <NavLink
              to="/register"
              className="hover:bg-[#163274] px-4 py-2 rounded transition"
            >
              Register
            </NavLink>
            <NavLink
              to="/login"
              className="hover:bg-[#163274] px-4 py-2 rounded transition"
            >
              Login
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}
