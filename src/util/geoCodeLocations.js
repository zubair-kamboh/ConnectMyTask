// src/util/geoCodeLocations.js
import axios from 'axios'

// Simple in-memory cache
const geocodeCache = {}

const geoCodeLocation = async (suburb, city, state) => {
  const address = `${suburb}, ${city}, ${state}`

  // If we already have the coordinates cached, return them
  if (geocodeCache[address]) {
    return geocodeCache[address]
  }

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&format=json`
    )
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0]
      const coordinates = [parseFloat(lat), parseFloat(lon)]

      // Save to cache
      geocodeCache[address] = coordinates
      return coordinates
    }
    return null
  } catch (error) {
    console.error('Error geocoding location:', error)
    return null
  }
}

export default geoCodeLocation
