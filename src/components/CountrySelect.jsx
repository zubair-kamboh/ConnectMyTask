import { useState, useEffect } from 'react'
import Select from 'react-select'
import Flag from 'react-world-flags'
import { toast } from 'react-hot-toast'
import geoCodeLocation from '../util/geoCodeLocations'
import { countryOptions } from '../util/countryOptions'
import { AiOutlineLoading3Quarters } from 'react-icons/ai' // or any spinner icon

export default function CountrySelect({
  defaultValue = 'AU',
  onCountryChange,
  onGeocodingStart = () => {},
  onGeocodingEnd = () => {},
  isDarkMode = true,
}) {
  const [loading, setLoading] = useState(false)
  // const [isDarkMode, setIsDarkMode] = useState(false)

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? '#2C2C2C' : '#fff',
      borderColor: '#E0E0E0',
      color: isDarkMode ? '#fff' : '#333',
      boxShadow: 'none',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? '#2C2C2C' : '#fff',
      color: isDarkMode ? '#fff' : '#333',
    }),
    singleValue: (base) => ({
      ...base,
      color: isDarkMode ? '#fff' : '#333',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? isDarkMode
          ? '#3b3b3b'
          : '#F0F0F0'
        : isDarkMode
        ? '#2C2C2C'
        : '#fff',
      color: isDarkMode ? '#fff' : '#333',
    }),
  }

  const handleCountrySelect = async (selectedOption) => {
    setLoading(true)
    onGeocodingStart()

    const countryCode = selectedOption.value
    const coordinates = await geoCodeLocation(countryCode, '', '')

    if (coordinates) {
      const [lat, lng] = coordinates
      onCountryChange({
        country: countryCode,
        lat,
        lng,
      })
    } else {
      toast.error('Could not retrieve coordinates for the selected country')
    }

    setLoading(false)
    onGeocodingEnd()
  }

  return (
    <div className="relative">
      <Select
        options={countryOptions}
        defaultValue={countryOptions.find((c) => c.value === defaultValue)}
        onChange={handleCountrySelect}
        isDisabled={loading}
        getOptionLabel={(e) => (
          <div className="flex items-center gap-2">
            <Flag code={e.value} style={{ width: 20, height: 15 }} />
            {e.label}
          </div>
        )}
        className={`w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] ${
          isDarkMode
            ? 'dark:bg-gray-800 dark:border-gray-600 dark:text-white'
            : ''
        }`}
        styles={customStyles} // Apply custom styles for dark/light mode
      />
      {loading && (
        <div className="absolute right-3 top-2.5 text-[#1A3D8F] animate-spin">
          <AiOutlineLoading3Quarters size={20} />
        </div>
      )}
    </div>
  )
}
