'use client'

import { useParams } from 'react-router-dom'
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
  FaComments,
} from 'react-icons/fa'
import useAcceptBid from '../hooks/useAcceptBid'
import ChatModal from './ChatModal'
import axios from 'axios'
import Loader from './Loader'
import UserComments from './UserComments'

export default function TaskDetailsPage() {
  const { taskId } = useParams()
  const [task, setTask] = useState(null)
  const [accepting, setAccepting] = useState(false)
  const { acceptBid, loading } = useAcceptBid()
  const [isOpen, setIsOpen] = useState(false)

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `http://localhost:3300/api/tasks/${taskId}`,
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-2xl p-6 space-y-6"
        >
          <h1 className="text-3xl font-bold text-gray-800">{task.title}</h1>

          <div className="flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              <FaDollarSign /> ${task.budget}
            </span>
            <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
              <FaCalendarAlt /> {new Date(task.deadline).toLocaleDateString()}
            </span>
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <FaCheckCircle /> {task.status}
            </span>
            <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              <FaTag /> {task.category}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-1">
              Description
            </h2>
            <p className="text-gray-600">{task.description}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FaMapMarkerAlt /> Location
              </h2>
              <p className="text-gray-600 mt-1">{task.location?.address}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FaUser /> Posted by
              </h2>
              <div className="flex items-center mt-2 gap-3">
                <div className="bg-gray-300 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                  {task.user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{task.user.name}</p>
                  <p className="text-gray-500 text-sm">{task.user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {task.images.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
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

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Offers</h2>

            {task.status === 'In Progress' &&
            task.assignedProvider &&
            currentUser.id === task.user._id ? (
              <OfferAcceptedSection
                task={task}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            ) : sortedBids.length === 0 ? (
              <p className="text-gray-500">No offers yet.</p>
            ) : (
              <div className="space-y-4">
                {sortedBids.map((bid) => (
                  <div
                    key={bid._id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                        {bid.provider.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">
                          {bid.provider.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {new Date(bid.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2">
                      Estimated Time: {bid.estimatedTime}
                    </p>
                    <p className="text-green-600 font-semibold mt-1">
                      ${bid.price}
                    </p>

                    {currentUser.id === task.user._id && (
                      <button
                        disabled={loading}
                        onClick={() => handleAcceptOffer(bid)}
                        className="mt-2 inline-block text-sm text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md disabled:opacity-50"
                      >
                        {loading ? 'Accepting...' : 'Accept Offer'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Task Completion and Review Form Section */}
          {task.status === 'In Progress' &&
            currentUser.id === task.user._id && (
              <TaskCompletionSection task={task} completeTask={completeTask} />
            )}

          <UserComments
            taskId={task._id}
            comments={task.comments}
            refreshTask={fetchTask}
          />
        </motion.div>
      </div>
    </Layout>
  )
}

// Lifted state version of OfferAcceptedSection
function OfferAcceptedSection({ task, isOpen, setIsOpen }) {
  const currentUser = JSON.parse(localStorage.getItem('user'))
  const isOwner = currentUser?.id === task?.user._id
  const isInProgress = task?.status === 'In Progress'
  const assignedProvider = task?.assignedProvider

  const acceptedBid = task?.bids?.find(
    (bid) => bid.provider._id === assignedProvider?._id
  )

  if (!isOwner || !isInProgress || !assignedProvider) return null

  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow-md mt-6">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Offer Accepted</h2>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={assignedProvider.profilePhoto}
          alt={assignedProvider.name}
          className="w-24 h-24 rounded-full border-4 border-white shadow-sm object-cover"
        />
        <div className="flex-1 space-y-2">
          <p className="text-lg font-semibold text-gray-800">
            {assignedProvider.name}
          </p>
          <p className="text-gray-700">{assignedProvider.email}</p>

          {acceptedBid && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Accepted Offer</p>
              <p className="text-gray-800 font-medium text-lg">
                ${acceptedBid.price}{' '}
                <span className="text-sm text-gray-500">
                  ({acceptedBid.estimatedTime})
                </span>
              </p>
            </div>
          )}

          {/* Chat Modal at the bottom of main component */}
          <ChatModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            provider={task?.assignedProvider}
            task={task}
          />

          {/* <ChatModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            user={task?.user}
            task={task}
          /> */}

          <button
            onClick={() => {
              setIsOpen(true)
            }}
            className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition"
          >
            <FaComments className="text-white" /> Contact Provider
          </button>
        </div>
      </div>
    </div>
  )
}
