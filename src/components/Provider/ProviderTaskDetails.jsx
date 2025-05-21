import React, { useEffect, useState } from 'react'
import {
  CalendarIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  XIcon,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import axios from 'axios'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import Loader from '../Loader'
import { toast } from 'react-hot-toast'
import useSubmitOffer from '../../hooks/useSubmitOffer'
import SubmitOffer from './SubmitOffer'
import Comments from './Comments'
import ChatModal from '../ChatModal'
import { useDarkMode } from '../../context/ThemeContext'

const Avatar = ({ name, src }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
    )
  }
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white font-bold flex items-center justify-center text-sm">
      {initials}
    </div>
  )
}

const ProviderTaskDetails = () => {
  const { taskId } = useParams()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [offerAmount, setOfferAmount] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')
  const [comment, setComment] = useState('')
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [textValue, setTextValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { darkMode } = useDarkMode()

  const {
    submitOffer,
    loading: offerLoading,
    error: offerError,
  } = useSubmitOffer()

  const [loggedInProviderId, setLoggedInProviderId] = useState(null)

  useEffect(() => {
    const providerId = JSON.parse(localStorage.getItem('provider')).id
    setLoggedInProviderId(providerId)
  }, [])

  const fetchTask = async () => {
    const token = localStorage.getItem('providerToken')
    try {
      const response = await axios.get(`/api/tasks/${taskId}/data`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      setTask(response.data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch task:', err)
      setError('Unable to load task details.')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTask()
  }, [taskId])

  const isBidAccepted =
    loggedInProviderId && task?.assignedProvider?._id === loggedInProviderId

  const hasAlreadyBid = task?.bids?.some(
    (bid) => bid.provider._id === loggedInProviderId
  )

  const handleSubmitOffer = async (id) => {
    if (!offerAmount || !estimatedTime || !comment) {
      toast.error('Please fill in all the fields.')
      return
    }

    const offerData = {
      price: parseFloat(offerAmount),
      estimatedTime,
      comment,
    }

    const response = await submitOffer(id, offerData)

    if (response) {
      toast.success('Offer submitted successfully')
      setShowModal(false) // Hide modal
      fetchTask() // ✅ Refresh task data only
    } else {
      toast.error('Failed to submit offer. Please try again.')
    }
  }

  const handlePostQuestion = async () => {
    if (!textValue.trim()) {
      toast.error('Please enter a question.')
      return
    }

    try {
      const token = localStorage.getItem('providerToken')
      await axios.post(
        `/api/tasks/${task?._id}/comment`,
        { text: textValue },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      toast.success('Question posted!')
      setTextValue('')
      fetchTask() // Refresh task details to show updated questions
    } catch (err) {
      console.error('Error posting question:', err)
      toast.error('Failed to post your question.')
    }
  }

  if (loading) return <Loader fullScreen />
  if (error) return <p>{error}</p>
  if (!task) return <p>No task found.</p>

  return (
    <AnimatePresence>
      {task && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="max-w-5xl mx-auto p-6 sm:p-10 relative"
          >
            {/* Close Button */}
            <button
              onClick={() => navigate('/provider/tasks')}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              <XIcon size={24} />
            </button>
            {/* Status + Title */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    task.status === 'Active'
                      ? 'text-[#FF6B6B]'
                      : task.status === 'In Progress'
                      ? 'text-[#2EC4B6]'
                      : 'text-[#888888]'
                  }`}
                >
                  {task.status.toUpperCase()}
                </span>
                <h1 className="text-3xl font-extrabold mt-2 text-[#001B5D] dark:text-[#D1E0FF]">
                  {task.title}
                </h1>
              </div>

              <div className="bg-[#f5f7fa] dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  TASK BUDGET
                </div>
                <div className="text-4xl font-extrabold text-[#001B5D] dark:text-white">
                  ${task.budget}
                </div>
                {!hasAlreadyBid ? (
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-4 bg-[#1A3D8F] hover:bg-[#163373] text-white text-lg font-semibold rounded-full px-6 py-3 w-full transition-all"
                  >
                    Make an offer
                  </button>
                ) : (
                  <p className="mt-4 text-sm text-red-600 dark:text-red-400 font-medium">
                    You have already submitted an offer for this task.
                  </p>
                )}
              </div>
            </div>

            <NavLink
              to={`/profile/${task.user._id}`}
              state={{ fromTaskPage: true }}
              className="flex items-center space-x-4 mb-4"
            >
              <Avatar
                name={task.user.name}
                src={task.user.avatar}
                size="xl"
                className="border-4 border-blue-500 shadow-md"
              />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Posted by
                </div>
                <div className="text-md font-medium text-[#001B5D] dark:text-white">
                  {task.user.name}
                </div>
                <ChatModal
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  user={task?.user}
                  task={task}
                  darkMode={darkMode}
                />
              </div>
            </NavLink>

            {/* Location + Time */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-600 dark:text-gray-300 mb-6 gap-4">
              <div className="flex items-center">
                <MapPinIcon className="mr-2" size={20} />
                {task.location?.address}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="mr-2" size={20} />
                {task.deadline
                  ? format(new Date(task.deadline), 'PPP')
                  : 'Flexible'}
              </div>
              <div className="flex items-center">
                <ClockIcon className="mr-2" size={20} />
                {format(new Date(task.createdAt), 'p')}
              </div>
            </div>

            {/* Task description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#001B5D] dark:text-white mb-2">
                Details
              </h2>
              <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">
                {task.description}
              </p>
            </div>

            {/* Image gallery */}
            {task.images && task.images.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#001B5D] dark:text-white mb-2">
                  Attachments
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {task.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`attachment-${index}`}
                      className="w-full rounded-lg shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}

            {task.status === 'Completed' ? (
              <div className="bg-gray-100 dark:bg-gray-800 border-l-4 border-[#1A3D8F] text-[#1A3D8F] p-6 rounded-lg shadow mb-6">
                <h2 className="text-3xl font-bold mb-2 text-[#1A3D8F] dark:text-blue-300">
                  🎉 Task Completed!
                </h2>
                <p className="text-[#1A3D8F] text-lg dark:text-blue-300">
                  This task has been successfully completed. Thank you for your
                  contribution!
                </p>
                <div className="mt-4 text-gray-800 dark:text-gray-200 space-y-2">
                  <p>
                    <strong>Title:</strong> {task.title}
                  </p>
                  <p>
                    <strong>Location:</strong> {task.location?.address || 'N/A'}
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
                {task.bids && task.bids.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-[#001B5D] dark:text-blue-300">
                        Bids
                      </h2>
                      <button
                        onClick={() => navigate('/provider/messages')}
                        className="flex items-center gap-2 bg-[#f0f4ff] dark:bg-[#1a2b5d] hover:bg-[#dce6ff] dark:hover:bg-[#2a3f75] text-[#1A3D8F] dark:text-white font-medium px-4 py-2 rounded-full shadow-sm transition"
                      >
                        <MailIcon size={18} />
                        Inbox
                      </button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                      {task.bids.map((bid) => (
                        <div
                          key={bid._id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900"
                        >
                          <div className="flex items-center mb-2">
                            <Avatar name={bid.provider.name} />
                            <div className="ml-3">
                              <div className="text-md font-semibold text-[#001B5D] dark:text-blue-200">
                                {bid.provider.name}{' '}
                                {loggedInProviderId === bid.provider._id && (
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    (You)
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {bid.provider.email}
                              </div>
                            </div>
                          </div>
                          <div className="text-gray-800 dark:text-gray-200 mb-1">
                            <strong>Price:</strong> ${bid.price}
                          </div>
                          <div className="text-gray-800 dark:text-gray-200 mb-1">
                            <strong>Estimated Time:</strong> {bid.estimatedTime}
                          </div>
                          {bid.comment && (
                            <div className="text-gray-800 dark:text-gray-200 mb-1">
                              <strong>Comment:</strong> {bid.comment}
                            </div>
                          )}
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(bid.date), 'PPPp')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Comments
                  taskId={task._id}
                  comments={task.comments}
                  refreshTask={fetchTask}
                />
                {isBidAccepted && (
                  <div className="mt-8 border border-[#1A3D8F] dark:border-blue-500 bg-[#F9FAFB] dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-[#1A3D8F] dark:text-blue-300">
                      Bid Accepted
                    </h2>
                    <div className="mt-4 text-[#666666] dark:text-gray-300">
                      <p>Your bid has been accepted for this task.</p>
                      <div className="mt-6">
                        <h3 className="text-md font-semibold text-[#1A3D8F] dark:text-blue-300">
                          Task Details:
                        </h3>
                        <p className="text-gray-800 dark:text-gray-200 mt-2">
                          <strong>Location:</strong> {task.location.address}
                        </p>
                        <p className="text-gray-800 dark:text-gray-200 mt-2">
                          <strong>Budget:</strong> ${task.budget}
                        </p>
                        <p className="text-gray-800 dark:text-gray-200 mt-2">
                          <strong>Deadline:</strong>{' '}
                          {format(new Date(task.deadline), 'PPPp')}
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={() => setIsOpen(true)}
                            className="bg-[#1A3D8F] text-white px-6 py-3 rounded-full hover:bg-[#163373] focus:ring-2 focus:ring-[#1A3D8F] transition duration-200"
                          >
                            Contact {task?.user.name || 'User'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Adding the task status with tags */}
                <div className="mt-4 flex gap-2">
                  <div className="mt-4 flex gap-2">
                    {task.status === 'Urgent' && (
                      <span className="bg-[#FF6B6B] text-white text-xs font-semibold px-4 py-1 rounded-full shadow dark:shadow-none">
                        Urgent
                      </span>
                    )}
                    {task.status === 'Ongoing' && (
                      <span className="bg-[#2EC4B6] text-white text-xs font-semibold px-4 py-1 rounded-full shadow dark:shadow-none">
                        Ongoing
                      </span>
                    )}
                  </div>
                </div>

                <SubmitOffer
                  isVisible={showModal}
                  onClose={() => setShowModal(false)}
                  onSubmit={handleSubmitOffer}
                  setOfferAmount={setOfferAmount}
                  setEstimatedTime={setEstimatedTime}
                  offerAmount={offerAmount}
                  comment={comment}
                  setComment={setComment}
                  task={task}
                  estimatedTime={estimatedTime}
                  handleSubmitOffer={handleSubmitOffer}
                >
                  <input
                    type="text"
                    placeholder="Enter something"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <textarea
                    placeholder="More details..."
                    className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                  />
                </SubmitOffer>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProviderTaskDetails
