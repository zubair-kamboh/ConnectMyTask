import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from './Layout'
import {
  FaDollarSign,
  FaCalendarAlt,
  FaCheckCircle,
  FaTag,
  FaMapMarkerAlt,
  FaUser,
  FaEdit,
  FaTrashAlt,
  FaComments,
} from 'react-icons/fa'
import useAcceptBid from '../hooks/useAcceptBid'
import ChatModal from './ChatModal'
import axios from 'axios'
import Loader from './Loader'
import UserComments from './UserComments'
import TaskCompletionSection from './TaskCompletion'
import { format } from 'date-fns'

import PostTaskModal from './PostTaskModel'
import { toast } from 'react-toastify'
import AcceptOfferModal from './ConfirmAcceptOffer'
import { useDarkMode } from '../context/ThemeContext'
import Avatar from './Avatar'

export default function TaskDetailsPage() {
  const { taskId } = useParams()
  const [task, setTask] = useState(null)
  const [accepting, setAccepting] = useState(false)
  const { acceptBid, loading } = useAcceptBid()
  const [isOpen, setIsOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedBid, setSelectedBid] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const { darkMode } = useDarkMode()

  const navigate = useNavigate()

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `http://localhost:3300/api/tasks/${taskId}/data`,
        {
          headers: { Authorization: `${token}` },
        }
      )
      setTask(response.data)
    } catch (err) {
      console.error('Error fetching task:', err)
    }
  }

  useEffect(() => {
    fetchTask()
  }, [taskId])

  const handleAcceptOffer = async (bid) => {
    setAccepting(true)
    await acceptBid(task._id, bid._id)
    window.location.reload()
  }

  if (!task || accepting) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    )
  }

  const sortedBids = [...(task.bids || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  const currentUser = JSON.parse(localStorage.getItem('user'))

  const handleDeleteTask = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    )
    if (!confirmed) return

    const token = localStorage.getItem('token')
    try {
      await axios.delete(`http://localhost:3300/api/tasks/${taskId}`, {
        headers: { Authorization: `${token}` },
      })
      toast.success('Task deleted successfully!')
      navigate('/user/dashboard/tasks')
    } catch (err) {
      toast.error('Failed to delete task.')
      console.error(err)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`shadow-lg rounded-2xl p-6 space-y-6 ${
            darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
          }`}
        >
          <h1 className="text-2xl font-semibold dark:text-white mb-6 text-[#1A3D8F]">
            {task.title}
          </h1>
          {currentUser?.id === task?.user._id && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setEditModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[#1A3D8F] hover:bg-[#14538A] text-white px-4 py-2 rounded-md text-sm transition"
              >
                <FaEdit className="text-white" />
                Edit Task
              </button>
              {editModalOpen && (
                <PostTaskModal
                  open={editModalOpen}
                  taskToEdit={task}
                  onClose={() => setEditModalOpen(false)}
                />
              )}

              <button
                onClick={handleDeleteTask}
                className="inline-flex items-center gap-2 bg-[#1A3D8F] hover:bg-[#14538A] text-white px-4 py-2 rounded-md text-sm transition"
              >
                <FaTrashAlt className="text-white" />
                Delete Task
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-sm">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-[#1A3D8F] text-white'
              }`}
            >
              <FaDollarSign /> ${task.budget}
            </span>
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-[#1A3D8F] text-white'
              }`}
            >
              <FaCalendarAlt /> {new Date(task.deadline).toLocaleDateString()}
            </span>
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-[#1A3D8F] text-white'
              }`}
            >
              <FaCheckCircle /> {task.status}
            </span>
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-[#1A3D8F] text-white'
              }`}
            >
              <FaTag /> {task.category}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-semibold dark:text-white mb-1 text-[#1A3D8F]">
              Description
            </h2>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              {task.description}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold text-[#1A3D8F] flex items-center gap-2 text-xl  dark:text-white mb-1 ">
                <FaMapMarkerAlt /> Location
              </h2>
              <p
                className={
                  darkMode ? 'text-gray-300 mt-1' : 'text-gray-600 mt-1'
                }
              >
                {task.location?.address || task.location.type.toUpperCase()}
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-[#1A3D8F] flex items-center gap-2 text-xl  dark:text-white mb-1">
                <FaUser /> Posted by
              </h2>
              <div className="flex items-center mt-2 gap-3">
                <div className="bg-gray-300 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                  {task.user.name.charAt(0)}
                </div>
                <div>
                  <p
                    className={
                      darkMode ? 'text-gray-300 ' : 'text-gray-600 font-medium'
                    }
                  >
                    {task.user.name}
                  </p>
                  <p
                    className={
                      darkMode ? 'text-gray-300 ' : 'text-gray-600 font-sm'
                    }
                  >
                    {task.user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {task.images.length > 0 && (
            <div className="mt-4">
              <h2 className="font-semibold text-[#1A3D8F] flex items-center gap-2 text-xl  dark:text-white mb-1">
                Images
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {task.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl h-64 bg-cover bg-center"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            </div>
          )}

          {task.status === 'Completed' ? (
            <div className="bg-[#1A3D8F] border-l-4 border-[#2EC4B6] text-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-3xl font-bold mb-2">🎉 Task Completed!</h2>
              <p className="text-white text-lg">
                This task has been successfully completed. Thank you for your
                contribution!
              </p>
              <div className="mt-4 text-white space-y-2">
                <p>
                  <strong>Title:</strong> {task.title}
                </p>
                <p>
                  <strong>Location:</strong> {task.location?.address}
                </p>
                <p>
                  <strong>Budget:</strong> ${task.budget}
                </p>
                <p>
                  <strong>Deadline:</strong>{' '}
                  {format(new Date(task.deadline), 'PPP')}
                </p>
                <p>
                  <strong>Posted By:</strong> {task.user.name}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Hide Offers Section when Task is completed */}
              {task.status !== 'Completed' && (
                <div className="mt-6 ">
                  <h2 className="font-semibold text-[#1A3D8F] flex items-center gap-2 text-xl  dark:text-white mb-1">
                    Offers
                  </h2>
                  {task.status === 'In Progress' &&
                  task.assignedProvider &&
                  currentUser.id === task.user._id ? (
                    <OfferAcceptedSection
                      task={task}
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      darkMode={darkMode}
                    />
                  ) : sortedBids.length === 0 ? (
                    <p className="text-gray-500">No offers yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {sortedBids.map((bid) => (
                        <div
                          key={bid._id}
                          className="bg-[#F0F5FF] dark:bg-gray-900 border border-[#1A3D8F]/20 dark:border-slate-600 p-4  rounded-lg border-[#E0E0E0]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-[#1A3D8F] text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                              {bid.provider.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-[#1A3D8F] dark:text-white font-medium">
                                {bid.provider.name}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {new Date(bid.date).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="mt-3 text-gray-600">{bid.details}</p>
                          <div className="mt-3 flex justify-between items-center">
                            <div>
                              <p className="text-[#1A3D8F] dark:text-white font-semibold">
                                ${bid.price}
                              </p>
                              <p className="text-[#1A3D8F] dark:text-white">
                                Comments: {bid.comment ? bid.comment : 'N/A'}
                              </p>
                            </div>
                            {task.status === 'Active' &&
                              task.user._id === currentUser.id && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedBid(bid)
                                      setShowConfirmModal(true)
                                    }}
                                    className="px-4 py-2 bg-[#1A3D8F] hover:bg-[#14538A] text-white rounded-md text-sm"
                                  >
                                    Accept Offer
                                  </button>
                                  <button
                                    onClick={() => {
                                      setIsOpen(true)
                                    }}
                                    className="flex items-center gap-1 text-sm bg-[#1A3D8F] hover:bg-[#14538A] text-white px-3 py-1 rounded"
                                  >
                                    <FaComments /> Chat
                                  </button>

                                  <ChatModal
                                    isOpen={isOpen}
                                    onClose={() => setIsOpen(false)}
                                    provider={bid.provider}
                                    task={task}
                                    darkMode={darkMode}
                                  />

                                  <NavLink
                                    to={`/provider/profile/${bid.provider._id}`}
                                    className="px-4 py-2 bg-[#1A3D8F] text-white rounded-md hover:bg-[#163473] transition-colors"
                                  >
                                    View Profile
                                  </NavLink>
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <AcceptOfferModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={async () => {
                  setShowConfirmModal(false)
                  await handleAcceptOffer(selectedBid)
                }}
              />

              <UserComments
                taskId={task._id}
                comments={task.comments}
                refreshTask={fetchTask}
              />
            </>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}

// Function to handle completing the task via the backend API
const completeTask = async (taskId, reviewData) => {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.put(
      `http://localhost:3300/api/tasks/${taskId}/completeTask`,
      reviewData,
      {
        headers: { Authorization: `${token}` },
      }
    )
    return response.data
  } catch (err) {
    console.error('Error completing task:', err)
    throw err
  }
}

const OfferAcceptedSection = ({ task, isOpen, setIsOpen, darkMode }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'))
  const isOwner = currentUser?.id === task?.user._id
  const isInProgress = task?.status === 'In Progress'
  const assignedProvider = task?.assignedProvider

  const acceptedBid = task?.bids?.find(
    (bid) => bid.provider._id === assignedProvider?._id
  )

  const [completionModalOpen, setCompletionModalOpen] = useState(false)

  useEffect(() => {
    if (completionModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [completionModalOpen])

  if (!isOwner || !isInProgress || !assignedProvider) return null
  return (
    <div className="bg-[#F0F5FF] dark:bg-[#1e293b] border border-[#1A3D8F]/20 dark:border-slate-600 rounded-2xl p-6 shadow-md mt-6">
      <h2 className="text-2xl font-bold text-[#1A3D8F] dark:text-white mb-4">
        Offer Accepted
      </h2>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Avatar
          name={assignedProvider.name}
          profilePhoto={assignedProvider.profilePhoto}
          size="xl"
          className="border-4 border-blue-500 shadow-md"
        />

        <div className="flex-1 space-y-2">
          <p className="text-lg font-semibold text-[#1A3D8F] dark:text-white">
            {assignedProvider.name}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {assignedProvider.email}
          </p>

          {acceptedBid && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Accepted Offer
              </p>
              <p className="text-[#1A3D8F] dark:text-green-400 font-medium text-lg">
                ${acceptedBid.price}{' '}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({acceptedBid.estimatedTime})
                </span>
              </p>
            </div>
          )}

          <ChatModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            provider={task?.assignedProvider}
            task={task}
            darkMode={darkMode}
          />

          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              to={`/provider/profile/${assignedProvider._id}`}
              className="bg-[#1A3D8F] text-white px-5 py-2 rounded-lg hover:bg-[#163473] flex items-center gap-2 transition"
            >
              View Full Profile
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-[#1A3D8F] text-white px-5 py-2 rounded-lg hover:bg-[#163473] flex items-center gap-2 transition"
            >
              <FaComments className="text-white" /> Contact Provider
            </button>
            <button
              onClick={() => setCompletionModalOpen(true)}
              className="bg-[#06D6A0] text-white px-5 py-2 rounded-lg hover:bg-[#05b790] flex items-center gap-2 transition"
            >
              <FaCheckCircle /> Complete Task
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Completing Task */}
      {completionModalOpen && (
        <div className="fixed z-[9999] inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 max-w-lg w-full rounded-xl p-6 shadow-xl relative">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-xl"
              onClick={() => setCompletionModalOpen(false)}
            >
              ×
            </button>
            <TaskCompletionSection
              task={task}
              completeTask={async (taskId, reviewData) => {
                await completeTask(taskId, reviewData)
                setCompletionModalOpen(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
