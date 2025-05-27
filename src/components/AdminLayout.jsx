import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiUsers, FiBriefcase, FiEdit2, FiLogOut, FiHome } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import logo from '../asset/PNG/connectmytask_logo.png'

export default function AdminLayout() {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  const navItems = [
    { to: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/admin/users', icon: FiUsers, label: 'Manage Users' },
    { to: '/admin/providers', icon: FiBriefcase, label: 'Manage Providers' },
    { to: '/admin/tasks', icon: FiEdit2, label: 'Manage Tasks' },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-gray-50 via-white to-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-2xl border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-center">
          <img
            src={logo}
            alt="ConnectMyTask Logo"
            className="h-12 object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-3 text-gray-700 font-medium">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out 
                hover:bg-indigo-100 hover:text-indigo-700 ${
                  isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''
                }`
              }
            >
              <Icon className="text-xl" />
              {label}
            </NavLink>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mt-8 text-red-500 transition-all duration-200 ease-in-out rounded-xl hover:bg-red-50 hover:text-red-700 w-full"
          >
            <FiLogOut className="text-xl" />
            Logout
          </button>
        </nav>

        {/* Footer */}
        <div className="p-4 text-xs text-center text-gray-400 border-t">
          &copy; {new Date().getFullYear()} TaskBoard Admin
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-white animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
