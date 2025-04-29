import React, { useState } from 'react'
import { CalendarIcon, ClockIcon, MapPinIcon, XIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

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

const tasks = [
  {
    title: 'End of lease cleaning',
    location: 'Springvale VIC',
    date: 'On Sat, 10 May',
    time: 'Anytime',
    price: '$250',
    open: true,
    offers: null,
    user: { name: 'John Doe', avatar: null },
    coordinates: [-37.946, 145.153],
  },
  {
    title: 'End of lease clean',
    location: 'Mentone VIC',
    date: 'On Fri, 2 May',
    time: 'Anytime',
    price: '$250',
    open: true,
    offers: '3 offers',
    user: { name: 'Alice Smith', avatar: 'https://i.pravatar.cc/100?img=5' },
    coordinates: [-37.983, 145.073],
  },
  {
    title: 'Boucle Couch steam cleaning',
    location: 'Kalkallo VIC',
    date: 'Before Thu, 1 May',
    time: 'Anytime',
    price: '$10',
    open: false,
    offers: null,
    user: { name: 'Bob Johnson', avatar: null },
    coordinates: [-37.526, 144.956],
  },
]

export default function TaskBrowser() {
  const [selectedTask, setSelectedTask] = useState(null)
  const [offerAmount, setOfferAmount] = useState('')
  const [offerMessage, setOfferMessage] = useState('')

  const handleCloseModal = () => {
    setSelectedTask(null)
    setOfferAmount('')
    setOfferMessage('')
  }

  const handleSubmitOffer = () => {
    alert(`Offer submitted: $${offerAmount}\nMessage: ${offerMessage}`)
    handleCloseModal()
  }

  const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

  return (
    <div className="bg-[#f6f7fb] min-h-screen">
      <header className="bg-white shadow px-6 md:px-10 py-6 flex items-center justify-center border-b">
        <div className="w-full max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="text-3xl md:text-4xl font-extrabold text-[#0073FF] tracking-tight">
              Airtasker
            </div>
            <button className="bg-[#0073FF] hover:bg-[#0060D6] text-white text-lg font-semibold rounded-full px-6 py-3 shadow">
              Post a task
            </button>
            <nav className="flex flex-wrap items-center space-x-4 text-[#001B5D] text-lg font-medium">
              <a href="#" className="hover:underline">
                Browse tasks
              </a>
              <a href="#" className="hover:underline">
                My tasks
              </a>
              <a href="#" className="hover:underline">
                List my services
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4 text-[#001B5D] text-lg font-medium">
            <a href="#" className="hover:underline">
              Help
            </a>
            <a href="#" className="hover:underline">
              Notifications
            </a>
            <a href="#" className="hover:underline">
              Messages
            </a>
            <div className="w-10 h-10 rounded-full bg-[#f0f4ff] flex items-center justify-center">
              <span className="text-[#b0c4ff] text-xl font-bold">●</span>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white px-6 md:px-10 py-5 border-b">
        <div className="w-full max-w-7xl mx-auto flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search for a task"
            className="bg-[#f2f3f7] text-base px-5 py-3 rounded-full placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0073FF] flex-1 min-w-[200px]"
          />
          {[
            'Category',
            '50km Hadfield VIC & remotely',
            'Any price',
            'Sort',
          ].map((label) => (
            <button
              key={label}
              className="bg-[#f2f3f7] text-[#001B5D] font-medium px-5 py-2.5 rounded-full hover:bg-[#e5e7eb] transition-all"
            >
              {label} ▼
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-center gap-6 py-6">
        <div className="w-full md:max-w-[420px] bg-[#f6f7fb] p-4 space-y-6 overflow-y-auto">
          {tasks.map((task, index) => (
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
                        {task.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon size={18} className="mr-2" />
                        {task.date}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <ClockIcon size={18} className="mr-2" />
                        {task.time}
                      </div>
                      <div className="text-[#0073FF] font-medium">
                        {task.open ? 'Open' : 'Closed'}{' '}
                        {task.offers && `· ${task.offers}`}
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold text-[#001B5D]">
                        {task.price}
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
            {tasks.map((task, index) => (
              <Marker key={index} position={task.coordinates} icon={customIcon}>
                <Popup>
                  <strong>{task.title}</strong>
                  <br />
                  {task.location}
                </Popup>
              </Marker>
            ))}
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
                    OPEN
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
                    {selectedTask.price}
                  </div>
                  <button
                    onClick={() => setOfferAmount('')} // show modal
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
                  {selectedTask.location}
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2" size={20} />
                  {selectedTask.date}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="mr-2" size={20} />
                  {selectedTask.time}
                </div>
              </div>

              {/* ✅ UPDATED Task Description */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-[#001B5D] mb-3">
                  Task Description
                </h2>
                <div className="bg-[#f5f7fa] p-5 rounded-xl text-gray-800 leading-relaxed">
                  <p className="mb-3">
                    I need a reliable Airtasker to help clean my 2-bedroom / 1
                    bathroom apartment for end-of-lease. All cleaning equipment
                    and products must be provided.
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>
                      Clean kitchen, including oven, stovetop, and rangehood
                    </li>
                    <li>Vacuum and mop all floors</li>
                    <li>Wipe down all surfaces, including windows and sills</li>
                    <li>Clean bathroom including shower, toilet, and sink</li>
                    <li>Remove cobwebs and dust light fittings</li>
                  </ul>
                  <p className="mt-4 text-sm text-gray-500">
                    Must be done before:{' '}
                    <span className="font-medium">{selectedTask.date}</span>
                  </p>
                </div>
              </div>

              {/* Offer modal shown conditionally */}
              {offerAmount !== '' && (
                <motion.div
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 60, opacity: 0 }}
                  className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-lg z-50"
                >
                  <h2 className="text-lg font-bold text-[#001B5D] mb-4">
                    Submit your offer
                  </h2>
                  <div className="grid gap-4">
                    <input
                      type="number"
                      placeholder="Your offer amount"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073FF]"
                    />
                    <textarea
                      placeholder="Message to task poster"
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      rows={3}
                      className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073FF]"
                    />
                    <div className="flex gap-4 justify-end">
                      <button
                        onClick={() => {
                          setOfferAmount('')
                          setOfferMessage('')
                        }}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitOffer}
                        className="px-6 py-2 rounded-lg bg-[#0073FF] text-white hover:bg-[#005ed9]"
                      >
                        Submit Offer
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
