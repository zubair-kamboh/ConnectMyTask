import React from 'react'

const Filters = () => {
  return (
    <div className="bg-white px-6 md:px-10 py-5 border-b">
      <div className="w-full max-w-7xl mx-auto flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search for a task"
          className="bg-[#F2F3F7] text-base px-5 py-3 rounded-full placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0073FF] flex-1 min-w-[200px]"
        />
        {['Category', '50km Hadfield VIC & remotely', 'Any price', 'Sort'].map(
          (label, index) => (
            <button
              key={index}
              className="bg-[#F2F3F7] text-[#1A3D8F] font-medium px-5 py-2.5 rounded-full hover:bg-[#E5E7EB] transition-all"
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
