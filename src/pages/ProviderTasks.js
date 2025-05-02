import React, { useState } from 'react'
import { CalendarIcon, ClockIcon, MapPinIcon, XIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Disclosure } from '@headlessui/react'
import Header from '../components/Provider/Header'
import Filters from '../components/Provider/Filters'
// import useProviderProfile from '../hooks/useProviderProfile'

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

export default function ProviderTasks() {
  const [selectedTask, setSelectedTask] = useState(null)
  const [offerAmount, setOfferAmount] = useState('')
  const [offerMessage, setOfferMessage] = useState('')
  const [showOfferForm, setShowOfferForm] = useState(false)
  // const profile = useProviderProfile()

  // console.log('Provider Profile:', profile)
  const task = {
    // ...other task data
    offers: [
      {
        id: 1,
        user: {
          name: 'Youbert E.',
          avatar: 'https://i.pravatar.cc/48?u=youbert',
          rating: 5.0,
          reviews: 187,
          completionRate: 98,
        },
        availability: 'Tomorrow',
        message: `Hi price includes labour, minor materials and airtasker fees. If you require additional materials eg new winder, motor or slats I will charge accordingly. Please check my reviews for similar jobs. We can discuss conversion on the day and this price will be taken into account.`,
        timePosted: '1 day ago',
      },
    ],
  }

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
      <Header />

      <Filters />
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

              {/* Task description (dummy for now) */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#001B5D] mb-2">
                  Details
                </h2>
                <ul className="list-decimal ml-6 text-gray-700 space-y-1">
                  <li>
                    Oven, oven trays, grill & hot plates to be cleaned inside
                    and out
                  </li>
                  <li>
                    Windows & windowsills to be cleaned inside and out, cobwebs
                    removed
                  </li>
                </ul>
              </div>

              {/* Image gallery */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#001B5D] mb-2">
                  Photos
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[
                    'https://res.cloudinary.com/dbfzfqfhl/image/upload/v1746084472/connectMyTask/task-photos/xfxikjjjyzjztcvx3yny.jpg',
                  ].map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Task image ${idx + 1}`}
                      className="rounded-lg object-cover w-full h-32 sm:h-40"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Offers</h2>
                <div className="space-y-4">
                  {task.offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="flex items-start gap-4 p-4 rounded-xl border bg-gray-50"
                    >
                      <Avatar
                        src={offer.user.avatar}
                        alt={offer.user.name}
                        fallback={offer.user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-semibold text-sm">
                          {offer.user.name}
                          <span className="text-orange-500 font-medium">
                            {offer.user.rating.toFixed(1)} ★
                          </span>
                          <span className="text-gray-500">
                            ({offer.user.reviews})
                          </span>
                          <span className="text-sm text-blue-800 ml-2 font-semibold">
                            {offer.user.completionRate}% Completion rate
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <strong>Availability:</strong> {offer.availability}
                        </div>
                        <div className="bg-white text-sm text-blue-900 p-3 mt-2 rounded-lg border">
                          {offer.message}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 flex gap-2 items-center">
                          {offer.timePosted}
                          <button className="text-blue-600 font-medium hover:underline">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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

                      {/* Task info header */}
                      <div className="flex items-center space-x-4 mb-6">
                        <Avatar
                          name={selectedTask.user.name}
                          src={selectedTask.user.avatar}
                        />
                        <div>
                          <div className="font-semibold text-lg text-[#001B5D]">
                            {selectedTask.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {selectedTask.location}
                          </div>
                        </div>
                      </div>

                      {/* Task details */}
                      <div className="space-y-3 text-[#001B5D]">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2" /> {selectedTask.date}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="mr-2" /> {selectedTask.time}
                        </div>

                        <p className="mt-4 text-gray-600">
                          This task needs to be completed by the deadline
                          listed. Offers are welcome from nearby workers. Please
                          include your availability in your offer.
                        </p>

                        <div className="mt-6 text-2xl font-bold text-[#0073FF]">
                          {selectedTask.price}
                        </div>

                        {/* Offer inputs */}
                        <input
                          type="number"
                          placeholder="Your offer amount"
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                          className="w-full border mt-4 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073FF]"
                        />

                        <textarea
                          placeholder="Message to task poster"
                          value={offerMessage}
                          onChange={(e) => setOfferMessage(e.target.value)}
                          rows={4}
                          className="w-full border mt-2 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073FF]"
                        />

                        <button
                          onClick={() => {
                            handleSubmitOffer()
                            setShowOfferForm(false)
                          }}
                          className="mt-4 w-full bg-[#0073FF] hover:bg-[#005ed9] text-white py-3 rounded-full text-lg font-semibold"
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
