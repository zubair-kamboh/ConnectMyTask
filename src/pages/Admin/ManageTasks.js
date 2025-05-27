import { useEffect, useState } from 'react'
import { Trash2, Search } from 'lucide-react'
import Loader from '../../components/Loader'
import axios from 'axios'

const ManageTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken')
        const { data } = await axios.get(
          'https://api.connectmytask.xyz/api/admin/tasks',
          {
            headers: {
              Authorization: `${adminToken}`,
            },
          }
        )
        setTasks(data)
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this task?'
    )
    if (!confirmDelete) return
    setLoading(true)
    try {
      const adminToken = localStorage.getItem('adminToken')
      const { res } = await axios.delete(
        `https://api.connectmytask.xyz/api/admin/task/${taskId}`,
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      )

      if (res.ok) {
        setTasks(tasks.filter((task) => task._id !== taskId))
      } else {
        console.error('Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = tasks.filter((task) =>
    (task.title + task.category)
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())
  )

  if (loading) return <Loader />

  return (
    <div className="max-h-screen overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Manage Tasks</h2>
          <div className="relative w-full sm:w-80">
            <Search className="absolute top-2.5 left-3 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by title or category..."
              className="pl-10 pr-4 py-2 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-gray-600">No tasks found.</div>
        ) : (
          <div className="grid gap-5">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md p-5 transition hover:shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {task.category} •{' '}
                      <span className="font-medium">${task.budget}</span>
                    </p>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {task.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: <span className="capitalize">{task.status}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Posted by: {task.user?.name} ({task.user?.email})
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Delete Task"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {task.images?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {task.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="task"
                        className="h-24 w-24 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageTasks
