import React from 'react'

const Header = () => {
  return (
    <header className="bg-white shadow px-6 md:px-10 py-6 flex items-center justify-center border-b">
      <div className="w-full max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="text-3xl md:text-4xl font-extrabold text-[#0073FF] tracking-tight">
            Connectmytask
          </div>
          <button className="bg-[#0073FF] hover:bg-[#0060D6] text-white text-lg font-semibold rounded-full px-6 py-3 shadow">
            Post a task
          </button>
          <nav className="flex flex-wrap items-center space-x-4 text-[#001B5D] text-lg font-medium">
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
        <div className="flex items-center space-x-4 text-[#001B5D] text-lg font-medium">
          <a href="#" className="hover:underline">
            Help
          </a>
          <a href="#" className="hover:underline">
            Notifications
          </a>
          <a href="#" className="hover:underline">
            Messages
          </a>
          <div className="w-10 h-10 rounded-full bg-[#f0f4ff] flex items-center justify-center">
            <span className="text-[#b0c4ff] text-xl font-bold">●</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
