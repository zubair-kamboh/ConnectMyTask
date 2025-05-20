import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  InputBase,
  Tabs,
  Tab,
  Paper,
  Avatar,
  CssBaseline,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EventIcon from '@mui/icons-material/Event'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIconPng from 'leaflet/dist/images/marker-icon.png'
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png'
import PostTaskModal from './PostTaskModel'
import axios from 'axios'
import TaskDetails from './TaskDetails'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import Filters from './Provider/Filters'
import DescriptionIcon from '@mui/icons-material/Description'

// Marker Icon for Leaflet
const DefaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
})
L.Marker.prototype.options.icon = DefaultIcon

export default function TaskPage() {
  const [openModal, setOpenModal] = useState(false)
  const [tasks, setTasks] = useState([])
  const [taskMarkers, setTaskMarkers] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const token = localStorage.getItem('token')
  const [filteredTasks, setFilteredTasks] = useState(tasks)
  const navigate = useNavigate()
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3300/api/tasks/alltasks/web',
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )

        const sortedTasks = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )

        setTasks(sortedTasks)

        const tasksWithCoords = response.data.map((task) => ({
          ...task,
          coordinates:
            task.location.lat && task.location.lng
              ? [task.location.lat, task.location.lng]
              : null,
        }))

        setTaskMarkers(tasksWithCoords)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }

    fetchTasks()
  }, [token])

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3300/api/tasks/${taskId}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      setTasks((prev) => prev.filter((task) => task._id !== taskId))
      setTaskMarkers((prev) => prev.filter((task) => task._id !== taskId))
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  return (
    <>
      <CssBaseline />
      <Box height="100vh" display="flex" flexDirection="column">
        <PostTaskModal open={openModal} onClose={() => setOpenModal(false)} />
        {selectedTask && <TaskDetails task={selectedTask} />}
        <Filters tasks={tasks} onFiltered={setFilteredTasks} />

        <Box display="flex" flex={1} overflow="hidden">
          {/* Sidebar */}
          <Box
            width="30%"
            bgcolor={theme.palette.background.default}
            color={theme.palette.text.primary}
            p={2}
            sx={{
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: isDarkMode ? '#2e2e2e' : '#f0f0f0',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: isDarkMode ? '#555' : '#c1c1c1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: isDarkMode ? '#888' : '#a0a0a0',
              },
              scrollbarWidth: 'thin',
              scrollbarColor: isDarkMode ? '#555 #2e2e2e' : '#c1c1c1 #f0f0f0',
            }}
          >
            <Typography variant="h6" gutterBottom>
              OPEN TASKS
            </Typography>

            {filteredTasks &&
              [...filteredTasks]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((task) => (
                  <Card
                    sx={{
                      mb: 2,
                      cursor: 'pointer',
                      borderColor: '#E0E0E0',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                      },
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                    }}
                    key={task._id}
                    onClick={() => navigate(`/user/dashboard/task/${task._id}`)}
                  >
                    <CardContent>
                      <Grid container justifyContent="space-between">
                        <Typography variant="h6">{task.title}</Typography>
                        <Typography variant="h6">${task.budget}</Typography>
                      </Grid>
                      <Box display="flex" alignItems="center" mt={1}>
                        {task.location?.type === 'remote' ? (
                          <>
                            <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {task.description
                                ?.split(' ')
                                .slice(0, 8)
                                .join(' ') + '...'}
                            </Typography>
                          </>
                        ) : (
                          <>
                            <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {task.location?.address}
                            </Typography>
                          </>
                        )}
                      </Box>
                      <Box display="flex" alignItems="center" mt={1}>
                        <EventIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {new Date(task.deadline).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mt={1}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {task.location?.type}
                        </Typography>
                      </Box>
                      <Box mt={2} display="flex" justifyContent="space-between">
                        <div
                          style={{
                            color:
                              task.status === 'Active'
                                ? '#FF6B6B'
                                : task.status === 'In Progress'
                                ? '#2EC4B6'
                                : theme.palette.text.primary,
                          }}
                        >
                          {task.status}
                          {task.bids.length > 0 &&
                            ` · ${task.bids.length} offer(s)`}
                        </div>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
          </Box>

          {/* Map Section */}
          <Box width="70%">
            <MapContainer
              center={[-37.8136, 144.9631]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution={
                  isDarkMode
                    ? '&copy; <a href="https://carto.com/attributions">CARTO</a> contributors'
                    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }
                url={
                  isDarkMode
                    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                }
              />

              {taskMarkers.map(
                (task) =>
                  task.coordinates && (
                    <Marker key={task._id} position={task.coordinates}>
                      <Popup>
                        <div className="max-w-sm rounded-xl shadow-md p-3 dark:bg-gray-900 bg-white dark:text-gray-100 text-gray-800">
                          {task.images?.length > 0 && (
                            <div className="mb-2 overflow-hidden rounded-lg">
                              <img
                                src={task.images[0]}
                                alt={task.title}
                                className="w-full h-32 object-cover rounded-md"
                              />
                            </div>
                          )}

                          <div className="flex justify-between mb-1">
                            <h3 className="text-lg font-semibold">
                              {task.title}
                            </h3>
                            <p className="text-md font-medium text-primary">
                              ${task.budget}
                            </p>
                          </div>

                          <div className="flex items-center mb-1 text-sm">
                            <LocationOnIcon className="mr-1 text-primary" />
                            <p className="truncate">{task.location?.address}</p>
                          </div>

                          <div className="flex items-center mb-1 text-sm">
                            <EventIcon className="mr-1 text-primary" />
                            <p>
                              {new Date(task.deadline).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="mb-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                task.status === 'Completed'
                                  ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                                  : task.status === 'Active'
                                  ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>

                          <button
                            className="w-full py-1 mt-2 text-white bg-[#1A3D8F] rounded-lg hover:bg-[#163373] focus:outline-none"
                            onClick={() =>
                              navigate(`/user/dashboard/task/${task._id}`)
                            }
                          >
                            View Task
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  )
              )}
            </MapContainer>

            {/* Floating Post Task Button - OUTSIDE map and flex containers */}
            <Button
              variant="contained"
              color="success"
              onClick={() => setIsModalOpen(true)}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 1300, // MUI modal zIndex is ~1300, so above that or less is fine
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                boxShadow: 3,
              }}
            >
              + Post a Task
            </Button>

            <PostTaskModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </Box>
        </Box>
      </Box>
    </>
  )
}
