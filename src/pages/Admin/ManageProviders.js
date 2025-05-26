import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader'
import axios from 'axios'
import Avatar from '../../components/Avatar'

export default function ManageProviders() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const providersPerPage = 5

  const navigate = useNavigate()

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken')
        const { data } = await axios.get('/api/admin/providers', {
          headers: {
            Authorization: `${adminToken}`,
          },
        })
        setProviders(data)
      } catch (error) {
        console.error('Failed to fetch providers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProviders()
  }, [])

  const handleDelete = async (id) => {
    setLoading(true)
    try {
      const adminToken = localStorage.getItem('adminToken')
      await axios.delete(`/api/admin/user/${id}`, {
        headers: {
          Authorization: `${adminToken}`,
        },
      })
      setProviders(providers.filter((p) => p._id !== id))
    } catch (error) {
      console.error('Failed to delete provider:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (id, newRole) => {
    setLoading(true)
    try {
      const adminToken = localStorage.getItem('adminToken')
      await axios.put(
        `/api/admin/users/${id}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      )
      setProviders(
        providers.map((p) => (p._id === id ? { ...p, role: newRole } : p))
      )
    } catch (error) {
      console.error('Failed to update role:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRankChange = async (id, newRank) => {
    setLoading(true)
    try {
      const adminToken = localStorage.getItem('adminToken')
      await axios.put(
        `/api/admin/users/${id}/rank`,
        { rank: newRank },
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      )
      setProviders(
        providers.map((p) => (p._id === id ? { ...p, rank: newRank } : p))
      )
    } catch (error) {
      console.error('Failed to update rank:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (id) => {
    setLoading(true)
    try {
      const adminToken = localStorage.getItem('adminToken')
      await axios.put(
        `/api/admin/users/${id}/verify`,
        {},
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      )
      setProviders(
        providers.map((p) => (p._id === id ? { ...p, isVerified: true } : p))
      )
    } catch (error) {
      console.error('Failed to verify provider:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProviders = providers.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  )

  const indexOfLast = currentPage * providersPerPage
  const indexOfFirst = indexOfLast - providersPerPage
  const currentProviders = filteredProviders.slice(indexOfFirst, indexOfLast)

  const totalPages = Math.ceil(filteredProviders.length / providersPerPage)

  if (loading) return <Loader />

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Manage Providers</h1>
      <input
        type="text"
        placeholder="Search by name or email..."
        className="border px-4 py-2 mb-4 rounded w-full max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="table-auto w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Photo</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Rank</th>
              <th className="p-2">Verified</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Tasks</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProviders.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <Avatar name={p.name} profilePhoto={p.profilePhoto} />
                </td>
                <td
                  className="p-2 cursor-pointer text-blue-500"
                  onClick={() => navigate(`/admin/user/${p._id}`)}
                >
                  {p.name}
                </td>
                <td className="p-2">{p.email}</td>
                <td className="p-2">
                  <select
                    value={p.role}
                    onChange={(e) => handleRoleChange(p._id, e.target.value)}
                    className="border px-1 py-0.5 rounded"
                  >
                    <option value="user">User</option>
                    <option value="provider">Provider</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-2">
                  <select
                    value={p.rank}
                    onChange={(e) => handleRankChange(p._id, e.target.value)}
                    className="border px-1 py-0.5 rounded"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                  </select>
                </td>
                <td className="p-2">
                  {p.isVerified ? (
                    'Yes'
                  ) : (
                    <button
                      onClick={() => handleVerify(p._id)}
                      className="bg-green-500 text-white px-2 py-1 text-xs rounded hover:bg-green-600"
                    >
                      Verify
                    </button>
                  )}
                </td>
                <td className="p-2">
                  {p.averageRating} ({p.totalReviews})
                </td>
                <td className="p-2">{p.completedTasks}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center gap-2 mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded border text-sm ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
