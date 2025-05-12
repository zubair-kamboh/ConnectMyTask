import React, { useState } from 'react'
import { CalendarIcon, ClockIcon, MapPinIcon, XIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer } from 'react-leaflet'
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
import { useNavigate } from 'react-router-dom'
import ProviderTaskDetails from '../components/Provider/ProviderTaskDetails'

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
  const { tasks, tasksLoading } = useProviderTasks()
  const navigate = useNavigate()

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
      {tasksLoading && <Loader fullScreen />}

      <Filters />
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-center gap-6 py-6">
        <div className="w-full h-[650px] md:max-w-[420px] bg-[#f6f7fb] p-4 space-y-6 overflow-y-auto">
          {tasks !== null &&
            tasks.map((task, index) => (
              <div
                key={index}
                onClick={() => navigate(`/provider/tasks/${task._id}`)}
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
                          {task.location?.address}
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
    </div>
  )
}
