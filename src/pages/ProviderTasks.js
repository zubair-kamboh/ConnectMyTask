import React, { useEffect, useState } from 'react'
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
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

const Card = ({ children }) => (
  <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl p-6 relative transition transform hover:scale-[1.015] border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-[0_4px_24px_rgba(255,255,255,0.05)] hover:ring-1 hover:ring-[#2EC4B6] dark:hover:ring-[#2EC4B6]">
    {children}
  </div>
)

const CardContent = ({ children }) => (
  <div className="space-y-3 text-gray-900 dark:text-gray-100">{children}</div>
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
  return (
    <div className="bg-[#F9FAFB] dark:bg-[#121212] min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      {tasksLoading && <Loader fullScreen />}
      <Filters tasks={tasks} onFiltered={setFilteredTasks} />

      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-center gap-6 py-6">
        {/* Left Panel - Task List */}
        <div className="w-full h-[650px] md:max-w-[420px] bg-[#F9FAFB] dark:bg-[#1e1e1e] p-4 space-y-6 overflow-y-auto scrollbar-custom rounded-2xl shadow-inner">
          {filteredTasks !== null &&
            [...filteredTasks]
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
                          <div className="text-xl font-semibold text-[#1A3D8F] dark:text-white">
                            {task.title}
                          </div>
                          <div className="flex items-center text-[#666666] dark:text-gray-400">
                            <MapPinIcon size={18} className="mr-2" />
                            {task.location?.address || task.location?.type}
                          </div>
                          <div className="flex items-center text-[#999999] dark:text-gray-400">
                            <CalendarIcon size={18} className="mr-2" />
                            {formatDistanceToNow(new Date(task.createdAt), {
                              addSuffix: true,
                            })}
                          </div>
                          <div className="flex items-center text-[#999999] dark:text-gray-400">
                            <ClockIcon size={18} className="mr-2" />
                            {format(new Date(task.createdAt), 'p')}
                          </div>
                          <div
                            className={`font-medium ${
                              task.status === 'Active'
                                ? 'text-[#FF6B6B]'
                                : task.status === 'In Progress'
                                ? 'text-[#2EC4B6]'
                                : 'text-[#666666] dark:text-gray-400'
                            }`}
                          >
                            {task.status}{' '}
                            {task.bids.length > 0 &&
                              `· ${task.bids.length} offer(s)`}
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-2xl font-bold text-[#1A3D8F] dark:text-white">
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

        {/* Right Panel - Map */}
        <div className="flex-1 h-[80vh]">
          <MapContainer
            center={[-37.85, 145.05]}
            zoom={10}
            className="h-full w-full z-0 rounded-2xl overflow-hidden"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {filteredTasks !== null &&
              filteredTasks.map((task, index) => (
                <Marker
                  key={index}
                  position={[
                    task.location?.lat || -37.85,
                    task.location?.lng || 145.05,
                  ]}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="w-64 p-3 space-y-2 text-left text-gray-800">
                      {/* Task title */}
                      <div className="text-lg font-semibold text-[#1A3D8F]  line-clamp-2">
                        {task.title}
                      </div>

                      {/* Location info */}
                      <div className="flex items-center text-sm text-gray-600 ">
                        <MapPinIcon size={16} className="mr-1.5" />
                        {task.location?.address || task.location?.type}
                      </div>

                      {/* User info */}
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar name={task.user.name} src={task.user.avatar} />
                        <div className="text-sm font-medium text-gray-700 ">
                          {task.user.name}
                        </div>
                      </div>

                      {/* Budget + Status */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-md font-bold text-[#1A3D8F] ">
                          ${task.budget}
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            task.status === 'Active'
                              ? 'bg-red-100 text-red-600 '
                              : task.status === 'In Progress'
                              ? 'bg-teal-100 text-teal-600 '
                              : 'bg-gray-200 text-gray-700 '
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>

                      {/* Action button */}
                      <button
                        onClick={() => handleTaskClick(task._id)}
                        className="mt-3 w-full bg-[#2EC4B6] text-white text-sm font-medium px-4 py-2 rounded-md transition"
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
