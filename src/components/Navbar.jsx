import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-[#1A3D8F] text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold hover:text-gray-200">
            ConnectMyTask
          </Link>
          <div className="space-x-4">
            <Link
              to="/"
              className="hover:bg-[#163274] px-4 py-2 rounded transition"
            >
              Home
            </Link>
            <Link
              to="/register"
              className="hover:bg-[#163274] px-4 py-2 rounded transition"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="hover:bg-[#163274] px-4 py-2 rounded transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
