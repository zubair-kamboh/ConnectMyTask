import { useState } from 'react'
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
}) {
  const [loading, setLoading] = useState(false)

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
        className="w-full border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3D8F]"
      />
      {loading && (
        <div className="absolute right-3 top-2.5 text-[#1A3D8F] animate-spin">
          <AiOutlineLoading3Quarters size={20} />
        </div>
      )}
    </div>
  )
}
