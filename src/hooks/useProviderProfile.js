import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useProviderProfile() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('providerToken')
    const provider = JSON.parse(localStorage.getItem('provider'))
    const storedProfile = localStorage.getItem('providerProfile')

    if (storedProfile) {
      setProfile(JSON.parse(storedProfile))
    } else if (provider) {
      axios.get(`/api/auth/profile/${provider.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }
  }, [])

  return profile
}
