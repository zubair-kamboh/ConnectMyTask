import React from 'react'

const Filters = (label) => {
  return (
    <div className="bg-white px-6 md:px-10 py-5 border-b">
      <div className="w-full max-w-7xl mx-auto flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search for a task"
          className="bg-[#f2f3f7] text-base px-5 py-3 rounded-full placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0073FF] flex-1 min-w-[200px]"
        />
        {['Category', '50km Hadfield VIC & remotely', 'Any price', 'Sort'].map(
          (label) => (
            <button
              key={label}
              className="bg-[#f2f3f7] text-[#001B5D] font-medium px-5 py-2.5 rounded-full hover:bg-[#e5e7eb] transition-all"
            >
              {label} ▼
            </button>
          )
        )}
      </div>
    </div>
  )
}

export default Filters
