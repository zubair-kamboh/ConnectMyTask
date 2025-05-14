import React, { useEffect, useState } from 'react'
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Disclosure } from '@headlessui/react'
import Header from '../components/Provider/Header'
import Filters from '../components/Provider/Filters'
import useProviderTasks from '../hooks/useProviderTasks'
import { format, formatDistanceToNow } from 'date-fns'
import { toast } from 'react-hot-toast'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'

// Avatar component
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
    <div className="w-10 h-10 rounded-full bg-[#E0E0E0] text-[#1A3D8F] font-bold flex items-center justify-center text-sm">
      {initials}
    </div>
  )
}

// Card Component to display task details
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
  const [filteredTasks, setFilteredTasks] = useState(tasks)

  useEffect(() => {
    if (tasks && Array.isArray(tasks)) {
      setFilteredTasks(tasks)
    }
  }, [tasks])

  const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

  // Handle task click navigation
  const handleTaskClick = (taskId) => {
    navigate(`/provider/tasks/${taskId}`)
  }
  // console.log(tasks.length)
  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <Header />
      {tasksLoading && <Loader fullScreen />}
      {console.log(tasks)}
      <Filters tasks={tasks} onFiltered={setFilteredTasks} />
      {/* <TaskList tasks={filteredTasks} /> */}
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-center gap-6 py-6">
        <div className="w-full h-[650px] md:max-w-[420px] bg-[#F9FAFB] p-4 space-y-6 overflow-y-auto">
          {tasks !== null &&
            [...tasks]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((task, index) => (
                <div
                  key={index}
                  onClick={() => handleTaskClick(task._id)}
                  className="cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  <Card>
                    <CardContent>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="text-xl font-semibold text-[#1A3D8F]">
                            {task.title}
                          </div>
                          <div className="flex items-center text-[#666666]">
                            <MapPinIcon size={18} className="mr-2" />
                            {task.location?.address || task.location?.type}
                          </div>
                          <div className="flex items-center text-[#999999]">
                            <CalendarIcon size={18} className="mr-2" />
                            {formatDistanceToNow(new Date(task.createdAt), {
                              addSuffix: true,
                            })}
                          </div>
                          <div className="flex items-center text-[#999999]">
                            <ClockIcon size={18} className="mr-2" />
                            {format(new Date(task.createdAt), 'p')}
                          </div>
                          <div
                            className={`font-medium ${
                              task.status === 'Active'
                                ? 'text-[#FF6B6B]'
                                : task.status === 'In Progress'
                                ? 'text-[#2EC4B6]'
                                : 'text-[#666666]'
                            }`}
                          >
                            {task.status}{' '}
                            {task.bids.length > 0 &&
                              `· ${task.bids.length} offer(s)`}
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-2xl font-bold text-[#1A3D8F]">
                            ${task.budget}
                          </div>
                          <Avatar
                            name={task.user.name}
                            src={task.user.avatar}
                          />
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
            className="h-full w-full z-0 rounded-2xl overflow-hidden"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {tasks !== null &&
              tasks.map((task, index) => (
                <Marker
                  key={index}
                  position={[
                    task.location?.lat || -37.85,
                    task.location?.lng || 145.05,
                  ]}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="flex flex-col items-center">
                      <Avatar name={task.user.name} src={task.user.avatar} />
                      <div className="text-xl font-semibold text-[#1A3D8F]">
                        {task.title}
                      </div>
                      <div className="text-[#666666]">
                        {task.location?.address || task.location?.type}
                      </div>
                      <button
                        onClick={() => handleTaskClick(task._id)}
                        className="mt-2 bg-[#FF6B6B] text-white px-4 py-2 rounded-full"
                      >
                        View Task
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
