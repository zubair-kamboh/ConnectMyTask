import React, { useState } from 'react'
import { CalendarIcon, ClockIcon, MapPinIcon, XIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Disclosure } from '@headlessui/react'
import Header from '../components/Provider/Header'
import Filters from '../components/Provider/Filters'
import useProviderProfile from '../hooks/useProviderProfile'
import useProviderTasks from '../hooks/useProviderTasks'
import { format, formatDistanceToNow } from 'date-fns'
import { toast, ToastContainer } from 'react-toastify'
import useSubmitOffer from '../hooks/useSubmitOffer'
import Loader from '../components/Loader'

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

const Card = ({ children }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 relative transition hover:shadow-lg">
    {children}
  </div>
)

const CardContent = ({ children }) => (
  <div className="space-y-3">{children}</div>
)

export default function ProviderTasks() {
  const [selectedTask, setSelectedTask] = useState(null)
  const [offerAmount, setOfferAmount] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')
  const [showOfferForm, setShowOfferForm] = useState(false)
  const { tasks, tasksLoading } = useProviderTasks()
  const { submitOffer, offerLoading } = useSubmitOffer()

  const handleCloseModal = () => {
    setSelectedTask(null)
    setOfferAmount('')
    setEstimatedTime('')
  }

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
      handleCloseModal()
    } else {
      toast.error('Failed to submit offer. Please try again.')
    }
  }

  const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

  return (
    <div className="bg-[#f6f7fb] min-h-screen">
      <Header />
      <ToastContainer />
      {(tasksLoading || offerLoading) && <Loader fullScreen />}

      <Filters />
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-center gap-6 py-6">
        <div className="w-full h-[650px] md:max-w-[420px] bg-[#f6f7fb] p-4 space-y-6 overflow-y-auto">
          {tasks !== null &&
            tasks.map((task, index) => (
              <div
                key={index}
                onClick={() => setSelectedTask(task)}
                className="cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <Card>
                  <CardContent>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="text-xl font-semibold text-[#001B5D]">
                          {task.title}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPinIcon size={18} className="mr-2" />
                          {`${task.location.suburb}, ${task.location.city}, ${task.location.state}`}
                        </div>

                        <div className="flex items-center text-gray-600">
                          <CalendarIcon size={18} className="mr-2" />
                          {formatDistanceToNow(new Date(task.createdAt), {
                            addSuffix: true,
                          })}
                        </div>

                        <div className="flex items-center text-gray-600">
                          <ClockIcon size={18} className="mr-2" />
                          {format(new Date(task.createdAt), 'p')}
                        </div>
                        <div className="text-[#0073FF] font-medium">
                          {task.status}{' '}
                          {task.bids.length > 0 &&
                            `· ${task.bids.length} offer(s)`}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-2xl font-bold text-[#001B5D]">
                          ${task.budget}
                        </div>
                        <Avatar name={task.user.name} src={task.user.avatar} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
        </div>

        <div className="flex-1 h-[80vh]">
          <MapContainer
            center={[-37.85, 145.05]}
            zoom={10}
            className="h-full w-full z-0"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {/* {tasks.map((task, index) => (
              <Marker key={index} position={task.coordinates} icon={customIcon}>
                <Popup>
                  <strong>{task.title}</strong>
                  <br />
                  {task.location}
                </Popup>
              </Marker>
            ))} */}
          </MapContainer>
        </div>
      </div>

      <AnimatePresence>
        {selectedTask && (
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
                onClick={handleCloseModal}
                className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
              >
                <XIcon size={24} />
              </button>

              {/* Status + Title */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                    {selectedTask.status.toUpperCase()}
                  </span>
                  <h1 className="text-3xl font-extrabold mt-2 text-[#001B5D]">
                    {selectedTask.title}
                  </h1>
                </div>

                {/* Budget box */}
                <div className="bg-[#f5f7fa] p-6 rounded-xl shadow-sm text-center">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    TASK BUDGET
                  </div>
                  <div className="text-4xl font-extrabold text-[#001B5D]">
                    ${selectedTask.budget}
                  </div>
                  <button
                    onClick={() => setShowOfferForm(true)}
                    className="mt-4 bg-[#0073FF] hover:bg-[#005ed9] text-white text-lg font-semibold rounded-full px-6 py-3 w-full transition-all"
                  >
                    Make an offer
                  </button>
                </div>
              </div>

              {/* Poster info */}
              <div className="flex items-center space-x-4 mb-4">
                <Avatar
                  name={selectedTask.user.name}
                  src={selectedTask.user.avatar}
                />
                <div>
                  <div className="text-sm text-gray-500">Posted by</div>
                  <div className="text-md font-medium text-[#001B5D]">
                    {selectedTask.user.name}
                  </div>
                </div>
              </div>

              {/* Location + Time */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-600 mb-6 gap-4">
                <div className="flex items-center">
                  <MapPinIcon className="mr-2" size={20} />
                  {selectedTask.location
                    ? `${selectedTask.location.suburb}, ${selectedTask.location.city}, ${selectedTask.location.state}`
                    : 'Location not provided'}
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2" size={20} />
                  {format(new Date(selectedTask.deadline), 'PPP')}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="mr-2" size={20} />
                  {format(new Date(selectedTask.deadline), 'p')}
                </div>
              </div>

              {/* Task description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#001B5D] mb-2">
                  Details
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedTask.description}
                </p>
              </div>

              {/* Image gallery */}
              {selectedTask.images && selectedTask.images.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-[#001B5D] mb-2">
                    Photos
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedTask.images.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`Task image ${idx + 1}`}
                        className="rounded-lg object-cover w-full h-32 sm:h-40"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Offers */}
              {selectedTask.bids && selectedTask.bids.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-semibold text-[#001B5D] mb-4">
                    Offers
                  </h2>
                  <div className="space-y-4">
                    {selectedTask.bids.map((bid, idx) => (
                      <div
                        key={idx}
                        className="border rounded-xl p-4 bg-gray-50"
                      >
                        <div className="font-medium text-[#001B5D]">
                          Offer:{' '}
                          <span className="text-gray-700">${bid.price}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Estimated time: {bid.estimatedTime}
                        </div>
                        <div className="text-sm text-gray-400">
                          Submitted on: {format(new Date(bid.date), 'PPP p')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ / info dropdowns */}
              <div className="mb-8 space-y-3">
                <h2 className="text-xl font-semibold text-[#001B5D] mb-2">
                  More Info
                </h2>
                {[
                  {
                    question: 'Is cleaning equipment provided?',
                    answer: 'No, please bring your own cleaning supplies.',
                  },
                  {
                    question: 'Can this be done on a weekday evening?',
                    answer: 'Yes, after 5 PM is preferred.',
                  },
                  {
                    question: 'Are there pets at the property?',
                    answer: 'No, this is a pet-free home.',
                  },
                ].map((item, idx) => (
                  <Disclosure key={idx}>
                    {({ open }) => (
                      <div className="border rounded-xl overflow-hidden">
                        <Disclosure.Button className="w-full flex justify-between items-center px-4 py-3 text-left text-[#001B5D] font-medium hover:bg-gray-50">
                          {item.question}
                          <span>{open ? '−' : '+'}</span>
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 py-2 text-gray-600 border-t bg-gray-50">
                          {item.answer}
                        </Disclosure.Panel>
                      </div>
                    )}
                  </Disclosure>
                ))}
              </div>

              <AnimatePresence>
                {showOfferForm && selectedTask && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white rounded-2xl w-full max-w-2xl p-8 relative shadow-xl"
                    >
                      {/* Close button */}
                      <button
                        onClick={() => setShowOfferForm(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                      >
                        <XIcon size={24} />
                      </button>

                      {/* Header */}
                      <h2 className="text-2xl font-bold text-[#001B5D] mb-6">
                        Make an Offer
                      </h2>

                      {/* Task summary */}
                      <div className="space-y-4 mb-6">
                        <div className="text-lg font-semibold text-[#001B5D]">
                          {selectedTask.title}
                        </div>
                        <p className="text-gray-700">
                          {selectedTask.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-gray-600">
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2" size={18} />
                            {format(new Date(selectedTask.deadline), 'PPP')}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="mr-2" size={18} />
                            {format(new Date(selectedTask.deadline), 'p')}
                          </div>
                          <div className="text-lg font-bold text-[#0073FF] ml-auto">
                            Budget: ${selectedTask.budget}
                          </div>
                        </div>
                      </div>

                      {/* Offer inputs */}
                      <div className="space-y-4">
                        <input
                          type="number"
                          placeholder="Enter your offer amount"
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                        />

                        <textarea
                          placeholder="Write an estimated time & details about your offer..."
                          className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={estimatedTime}
                          onChange={(e) => setEstimatedTime(e.target.value)}
                        />

                        <button
                          onClick={() => handleSubmitOffer(selectedTask._id)}
                          className="w-full bg-[#0073FF] hover:bg-[#005ed9] text-white text-lg font-semibold rounded-full py-3 transition"
                        >
                          Submit Offer
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
