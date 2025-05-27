import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Loader from '../../components/Loader'
import Avatar from '../../components/Avatar'

const UserDetails = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken')
        const { data } = await axios.get(
          `https://api.connectmytask.xyz/api/admin/users/${userId}`,
          {
            headers: {
              Authorization: `${adminToken}`,
            },
          }
        )
        setUser(data)
      } catch (error) {
        console.error('Failed to fetch user details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (loading) return <Loader />

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load user details.
      </div>
    )

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-start">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-2xl">
        <div className="flex flex-col items-center text-center">
          <Avatar name={user.name} profilePhoto={user.profilePhoto} size="xl" />
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-400 mt-1">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailItem label="Role" value={user.role} />
          <DetailItem label="Verified" value={user.isVerified ? 'Yes' : 'No'} />
          <DetailItem label="Rank" value={user.rank} />
          <DetailItem label="Skills" value={user.skills?.join(', ') || 'N/A'} />
          <DetailItem label="Completed Tasks" value={user.completedTasks} />
          <DetailItem label="Recommendations" value={user.recommendations} />
          <DetailItem
            label="Average Rating"
            value={`${user.averageRating} (${user.totalReviews} reviews)`}
          />
          <DetailItem
            label="Last Updated"
            value={new Date(user.updatedAt).toLocaleDateString()}
          />
        </div>
      </div>
    </div>
  )
}

const DetailItem = ({ label, value }) => (
  <div className="bg-gray-100 p-4 rounded-lg">
    <p className="text-xs text-gray-500 uppercase font-semibold">{label}</p>
    <p className="text-sm font-medium text-gray-800 mt-1">{value}</p>
  </div>
)

export default UserDetails
