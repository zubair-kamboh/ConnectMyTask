import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader'
import axios from 'axios'
import Avatar from '../../components/Avatar'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 5

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken')
        const { data } = await axios.get(
          'https://api.connectmytask.xyz/api/admin/users',
          {
            headers: {
              Authorization: `${adminToken}`,
            },
          }
        )
        setUsers(data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleDelete = async (id) => {
    setLoading(true)
    try {
      const adminToken = localStorage.getItem('adminToken')
      await axios.delete(`https://api.connectmytask.xyz/api/admin/user/${id}`, {
        headers: {
          Authorization: `${adminToken}`,
        },
      })
      setLoading(false)
      setUsers(users.filter((user) => user._id !== id))
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const handleRoleChange = async (id, newRole) => {
    setLoading(true)
    try {
      const adminToken = localStorage.getItem('adminToken')
      await axios.put(
        `https://api.connectmytask.xyz/api/admin/users/${id}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      )
      setLoading(false)
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, role: newRole } : user
        )
      )
    } catch (error) {
      console.error('Failed to update role:', error)
    }
  }

  const handleRankChange = async (id, newRank) => {
    setLoading(true)
    try {
      const adminToken = localStorage.getItem('adminToken')
      await axios.put(
        `https://api.connectmytask.xyz/api/admin/users/${id}/rank`,
        { rank: newRank },
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      )
      setLoading(false)
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, rank: newRank } : user
        )
      )
    } catch (error) {
      console.error('Failed to update rank:', error)
    }
  }

  const handleVerifyUser = async (id) => {
    setLoading(true)
    try {
      const adminToken = localStorage.getItem('adminToken')
      await axios.put(
        `https://api.connectmytask.xyz/api/admin/users/${id}/verify`,
        {},
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      )
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, isVerified: true } : user
        )
      )
    } catch (error) {
      console.error('Failed to verify user:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  )

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  if (loading) return <Loader />

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
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
            {currentUsers.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <Avatar name={user.name} profilePhoto={user.profilePhoto} />
                </td>
                <td
                  className="p-2 cursor-pointer text-blue-500"
                  onClick={() => navigate(`/admin/user/${user._id}`)}
                >
                  {user.name}
                </td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="border px-1 py-0.5 rounded"
                  >
                    <option value="user">User</option>
                    <option value="provider">Provider</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-2">
                  <select
                    value={user.rank}
                    onChange={(e) => handleRankChange(user._id, e.target.value)}
                    className="border px-1 py-0.5 rounded"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                  </select>
                </td>
                <td className="p-2">
                  {user.isVerified ? (
                    'Yes'
                  ) : (
                    <button
                      onClick={() => handleVerifyUser(user._id)}
                      className="bg-green-500 text-white px-2 py-1 text-xs rounded hover:bg-green-600"
                    >
                      Verify
                    </button>
                  )}
                </td>
                <td className="p-2">
                  {user.averageRating} ({user.totalReviews})
                </td>
                <td className="p-2">{user.completedTasks}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(user._id)}
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
