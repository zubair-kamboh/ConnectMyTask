// hooks/useAcceptBid.js
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function useAcceptBid() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const acceptBid = async (taskId, bidId) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      const response = axios.put(
        `http://localhost:3300/api/tasks/${taskId}/acceptBid/${bidId}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )

      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to accept offer'
      toast.error(message)
      setError(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { acceptBid, loading, error }
}
