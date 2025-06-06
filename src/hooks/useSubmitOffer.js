import { useState } from 'react'
import axios from 'axios'

export default function useAcceptBid() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submitOffer = async (taskId, offerData) => {
    setLoading(true)
    setError(null)

    const providerToken = localStorage.getItem('providerToken')
    if (!providerToken) {
      const errMsg = 'Provider token is missing.'
      setError(errMsg)
      setLoading(false)
      return null
    }

    try {
      const response = await axios.post(
        `https://api.connectmytask.xyz/api/tasks/${taskId}/bid`,
        offerData,
        {
          headers: {
            Authorization: providerToken,
          },
        }
      )
      setLoading(false)
      return response.data
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'An error occurred while submitting the offer.'
      setError(msg)
      setLoading(false)
      return null
    }
  }

  return { submitOffer, loading, error }
}
