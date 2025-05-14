import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function useProviderTasks() {
  const [tasks, setTasks] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('providerToken')

    const fetchTasks = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://localhost:3300/api/tasks', {
          headers: {
            Authorization: `${token}`,
          },
        })
        console.log(response)
        setTasks(response.data)
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          'An error occurred while fetching tasks.'
        setError(msg)
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchTasks()
    } else {
      const msg = 'Provider token is missing.'
      setError(msg)
      toast.error(msg)
    }
  }, [])

  return { tasks, error, loading }
}
