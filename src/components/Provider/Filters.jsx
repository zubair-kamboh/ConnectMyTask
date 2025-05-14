import React, { useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import {
  ChevronDown,
  MapPin,
  Tag,
  DollarSign,
  Filter as FilterIcon,
  X,
} from 'lucide-react'

const categories = [
  'All Categories',
  'Cleaning',
  'Delivery',
  'Gardening',
  'Tech Help',
]
const locations = ['Anywhere', 'Within 5km', 'Within 20km', 'Hadfield VIC']
const prices = ['Any Price', 'Under $50', '$50 - $100', '$100+']
const sortOptions = ['Newest First', 'Lowest Price', 'Highest Price']

const FilterDropdown = ({ label, icon: Icon, options, selected, onChange }) => (
  <div className="w-full sm:w-auto">
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button
            className="bg-[#F2F3F7] text-[#1A3D8F] px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 
  hover:bg-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] focus:ring-offset-1 
  transition-all w-full sm:w-48 text-left"
          >
            <Icon size={16} />
            <span className="truncate">{selected}</span>
            <ChevronDown
              size={16}
              className={`${open ? 'rotate-180 transform' : ''}`}
            />
          </Listbox.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 z-10 w-full sm:w-48 bg-white shadow-lg rounded-xl overflow-hidden text-sm text-[#1A3D8F] ring-1 ring-gray-200">
              {options.map((option, i) => (
                <Listbox.Option
                  key={i}
                  value={option}
                  className={({ active }) =>
                    `cursor-pointer px-4 py-2 ${active ? 'bg-[#F2F3F7]' : ''}`
                  }
                >
                  {option}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  </div>
)

const Filters = () => {
  const [category, setCategory] = useState(categories[0])
  const [location, setLocation] = useState(locations[0])
  const [price, setPrice] = useState(prices[0])
  const [sort, setSort] = useState(sortOptions[0])

  const isFiltered =
    category !== categories[0] ||
    location !== locations[0] ||
    price !== prices[0] ||
    sort !== sortOptions[0]

  const clearFilters = () => {
    setCategory(categories[0])
    setLocation(locations[0])
    setPrice(prices[0])
    setSort(sortOptions[0])
  }

  return (
    <div className="bg-white px-6 md:px-10 py-5 border-b shadow-sm sticky top-0 z-10">
      <div className="w-full max-w-7xl mx-auto flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-[#1A3D8F] font-semibold text-sm">
          <FilterIcon size={18} />
          Filters
        </div>

        <input
          type="text"
          placeholder="Search for a task..."
          className="bg-[#F2F3F7] text-sm px-5 py-2.5 rounded-full placeholder:text-[#9CA3AF]
    focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] focus:ring-offset-1
    hover:bg-[#E5E7EB] transition-all duration-200 flex-1 min-w-[200px]"
        />

        <FilterDropdown
          label="Category"
          icon={Tag}
          options={categories}
          selected={category}
          onChange={setCategory}
        />
        <FilterDropdown
          label="Location"
          icon={MapPin}
          options={locations}
          selected={location}
          onChange={setLocation}
        />
        <FilterDropdown
          label="Price"
          icon={DollarSign}
          options={prices}
          selected={price}
          onChange={setPrice}
        />
        <FilterDropdown
          label="Sort"
          icon={ChevronDown}
          options={sortOptions}
          selected={sort}
          onChange={setSort}
        />

        {isFiltered && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-[#1A3D8F] px-4 py-2 rounded-full bg-[#F2F3F7] hover:bg-[#E5E7EB] transition"
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
