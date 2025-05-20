import React, { useRef, useEffect, useState } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'

// Reusable component
const PlaceAutocomplete = ({ onPlaceSelect }) => {
  const placesLib = useMapsLibrary('places')
  const inputRef = useRef(null)
  const [autocomplete, setAutocomplete] = useState(null)

  const token = localStorage.getItem('token')
  const providerToken = localStorage.getItem('providerToken')
  const isAuthenticated = Boolean(token || providerToken)

  useEffect(() => {
    if (!placesLib || !inputRef.current) return

    const options = {
      fields: ['geometry', 'name', 'formatted_address'],
      types: ['address'],
    }

    const ac = new placesLib.Autocomplete(inputRef.current, options)
    setAutocomplete(ac)
  }, [placesLib])

  useEffect(() => {
    if (!autocomplete) return

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      onPlaceSelect(place)
    })

    return () => listener?.remove()
  }, [autocomplete, onPlaceSelect])

  const inputClass = isAuthenticated
    ? `
        w-full px-4 py-2 rounded-md 
        border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] 
        text-[#333] bg-white 
        dark:text-white dark:bg-[#1E1E1E] dark:border-[#444] dark:placeholder-gray-400
      `
    : `
        w-full px-4 py-2 rounded-md 
        border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#1A3D8F] 
        text-[#333] bg-white placeholder-gray-500
      `

  return (
    <div className="relative z-[1000]">
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter your location"
        className={inputClass}
        autoComplete="off"
      />
    </div>
  )
}

export default PlaceAutocomplete
