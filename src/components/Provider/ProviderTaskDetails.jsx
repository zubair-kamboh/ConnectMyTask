import React, { useEffect, useState } from 'react'
import { CalendarIcon, ClockIcon, MapPinIcon, XIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../Loader'
import { toast } from 'react-toastify'
import useSubmitOffer from '../../hooks/useSubmitOffer'
import SubmitOffer from './SubmitOffer'
import Comments from './Comments'

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
    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
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
  const [showOfferForm, setShowOfferForm] = useState(false)
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [textValue, setTextValue] = useState('')

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
      const response = await axios.get(
        `http://localhost:3300/api/tasks/${taskId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
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

  console.log(task)

  const isBidAccepted =
    loggedInProviderId && task?.assignedProvider?._id === loggedInProviderId

  const hasAlreadyBid = task?.bids?.some(
    (bid) => bid.provider._id === loggedInProviderId
  )

  const handleSubmitOffer = async (id) => {
    if (!offerAmount || !estimatedTime) {
      toast.error('Please fill in all the fields.')
      return
    }

    const offerData = {
      price: parseFloat(offerAmount),
      estimatedTime,
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
      console.log(token)
      await axios.post(
        `http://localhost:3300/api/tasks/${task?._id}/comment`,
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

  console.log(textValue)

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
          className="fixed inset-0 bg-white z-50 overflow-y-auto"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="max-w-5xl mx-auto p-6 sm:p-10 relative"
          >
            <button
              onClick={() => navigate('/provider/tasks')}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
            >
              <XIcon size={24} />
            </button>

            {/* Status + Title */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  {task.status.toUpperCase()}
                </span>
                <h1 className="text-3xl font-extrabold mt-2 text-[#001B5D]">
                  {task.title}
                </h1>
              </div>

              {/* Budget box */}
              <div className="bg-[#f5f7fa] p-6 rounded-xl shadow-sm text-center">
                <div className="text-sm font-medium text-gray-500 mb-1">
                  TASK BUDGET
                </div>
                <div className="text-4xl font-extrabold text-[#001B5D]">
                  ${task.budget}
                </div>
                {!hasAlreadyBid ? (
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-4 bg-[#0073FF] hover:bg-[#005ed9] text-white text-lg font-semibold rounded-full px-6 py-3 w-full transition-all"
                  >
                    Make an offer
                  </button>
                ) : (
                  <p className="mt-4 text-sm text-red-600 font-medium">
                    You have already submitted an offer for this task.
                  </p>
                )}
              </div>
            </div>

            {/* Poster info */}
            <div className="flex items-center space-x-4 mb-4">
              <Avatar name={task.user.name} src={task.user.avatar} />
              <div>
                <div className="text-sm text-gray-500">Posted by</div>
                <div className="text-md font-medium text-[#001B5D]">
                  {task.user.name}
                </div>
              </div>
            </div>

            {/* Location + Time */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-600 mb-6 gap-4">
              <div className="flex items-center">
                <MapPinIcon className="mr-2" size={20} />
                {task.location?.address}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="mr-2" size={20} />
                {format(new Date(task.deadline), 'PPP')}
              </div>
              <div className="flex items-center">
                <ClockIcon className="mr-2" size={20} />
                {format(new Date(task.createdAt), 'p')}
              </div>
            </div>

            {/* Task description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#001B5D] mb-2">
                Details
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {task.description}
              </p>
            </div>

            {/* Image gallery */}
            {task.images && task.images.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#001B5D] mb-2">
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

            <Comments
              taskId={task._id}
              comments={task.comments}
              refreshTask={fetchTask}
            />

            {task.bids && task.bids.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#001B5D] mb-4">
                  Bids
                </h2>
                <div className="max-h-[400px] overflow-y-auto space-y-4">
                  {task.bids.map((bid) => (
                    <div
                      key={bid._id}
                      className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
                    >
                      <div className="flex items-center mb-2">
                        <Avatar name={bid.provider.name} />
                        <div className="ml-3">
                          <div className="text-md font-semibold text-[#001B5D]">
                            {bid.provider.name}{' '}
                            {loggedInProviderId === bid.provider._id && (
                              <span className="text-sm text-gray-500">
                                (You)
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {bid.provider.email}
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-800 mb-1">
                        <strong>Price:</strong> ${bid.price}
                      </div>
                      <div className="text-gray-800 mb-1">
                        <strong>Estimated Time:</strong> {bid.estimatedTime}
                      </div>
                      {bid.comment && (
                        <div className="text-gray-800 mb-1">
                          <strong>Comment:</strong> {bid.comment}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        {format(new Date(bid.date), 'PPPp')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isBidAccepted && (
              <div className="mt-8 border border-green-500 bg-green-100 p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-green-700">
                  Bid Accepted
                </h2>
                <div className="mt-2">
                  <p>Your bid has been accepted for this task.</p>
                  <div className="mt-4">
                    <h3 className="text-md font-semibold">Task Details:</h3>
                    <p>
                      <strong>Location:</strong> {task.location.address}
                    </p>
                    <p>
                      <strong>Budget:</strong> ${task.budget}
                    </p>
                    <p>
                      <strong>Deadline:</strong>{' '}
                      {format(new Date(task.deadline), 'PPPp')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <SubmitOffer
              isVisible={showModal}
              onClose={() => setShowModal(false)}
              onSubmit={handleSubmitOffer}
              setOfferAmount={setOfferAmount}
              setEstimatedTime={setEstimatedTime}
              offerAmount={offerAmount}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProviderTaskDetails
