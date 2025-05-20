import { useState, useMemo, useEffect } from 'react'
import { Filter as FilterIcon, X } from 'lucide-react'

const Filters = ({ tasks, onFiltered }) => {
  const [status, setStatus] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [category, setCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return []
    return tasks.filter((task) => {
      const matchesStatus = status ? task.status === status : true
      const matchesCategory = category ? task.category === category : true
      const matchesMinPrice = minPrice
        ? task.budget >= parseFloat(minPrice)
        : true
      const matchesMaxPrice = maxPrice
        ? task.budget <= parseFloat(maxPrice)
        : true
      const matchesSearch = searchQuery
        ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      return (
        matchesStatus &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesSearch
      )
    })
  }, [tasks, status, category, minPrice, maxPrice, searchQuery])

  useEffect(() => {
    onFiltered(filteredTasks)
  }, [filteredTasks, onFiltered])

  const clearFilters = () => {
    setStatus('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
  }

  const isFiltered = status || category || minPrice || maxPrice

  return (
    <div className="bg-white dark:bg-gray-900 px-6 md:px-10 py-5 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
      <div className="w-full max-w-7xl mx-auto flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-[#1A3D8F] dark:text-[#FFD600] font-semibold text-sm">
          <FilterIcon size={18} />
          Filters
        </div>

        <input
          type="text"
          placeholder="Search for a task..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#F2F3F7] dark:bg-gray-800 dark:text-white text-sm px-5 py-2.5 rounded-full placeholder:text-[#9CA3AF] dark:placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] dark:focus:ring-[#FFD600] focus:ring-offset-1
            hover:bg-[#E5E7EB] dark:hover:bg-gray-700 transition-all duration-200 flex-1 min-w-[200px]"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-[#F2F3F7] dark:bg-gray-800 text-[#1A3D8F] dark:text-white text-sm font-medium px-5 py-2.5 rounded-full 
            hover:bg-[#E5E7EB] dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] dark:focus:ring-[#FFD600] focus:ring-offset-1
            transition-all w-full sm:w-48"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-[#F2F3F7] dark:bg-gray-800 text-[#1A3D8F] dark:text-white text-sm font-medium px-5 py-2.5 rounded-full 
            hover:bg-[#E5E7EB] dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] dark:focus:ring-[#FFD600] focus:ring-offset-1
            transition-all w-full sm:w-48"
        >
          <option value="">All Categories</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Moving">Moving</option>
          <option value="Handyman">Handyman</option>
          <option value="Delivery">Delivery</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="bg-[#F2F3F7] dark:bg-gray-800 text-sm text-[#1A3D8F] dark:text-white px-5 py-2.5 rounded-full w-24
            placeholder:text-[#9CA3AF] dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] dark:focus:ring-[#FFD600] focus:ring-offset-1
            hover:bg-[#E5E7EB] dark:hover:bg-gray-700 transition-all"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="bg-[#F2F3F7] dark:bg-gray-800 text-sm text-[#1A3D8F] dark:text-white px-5 py-2.5 rounded-full w-24
            placeholder:text-[#9CA3AF] dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] dark:focus:ring-[#FFD600] focus:ring-offset-1
            hover:bg-[#E5E7EB] dark:hover:bg-gray-700 transition-all"
        />

        {isFiltered && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-[#1A3D8F] dark:text-[#FFD600] px-4 py-2 rounded-full bg-[#F2F3F7] dark:bg-gray-800 hover:bg-[#E5E7EB] dark:hover:bg-gray-700 transition"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

export default Filters
