import React, { useState, useMemo, useEffect } from 'react'
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
  createTheme,
  ThemeProvider,
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
import geoCodeLocations from '../util/geoCodeLocations'
import TaskDetails from './TaskDetails'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'

// Marker Icon for Leaflet
const DefaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
})
L.Marker.prototype.options.icon = DefaultIcon

const theme = createTheme({
  palette: {
    primary: {
      main: '#1A3D8F', // Primary Blue
    },
    secondary: {
      main: '#06D6A0', // Accent Green/Teal
    },
    background: {
      default: '#F9FAFB', // Light Background
    },
    text: {
      primary: '#666666', // Grey text color
      secondary: '#999999', // Lighter grey for icons
    },
  },
})

export default function TaskPage() {
  const [openModal, setOpenModal] = useState(false)
  const [tasks, setTasks] = useState([])
  const [taskMarkers, setTaskMarkers] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  const navigate = useNavigate()

  // Fetch tasks immediately
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

        // Sort tasks by creation date (newest first)
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box height="100vh" display="flex" flexDirection="column">
        {/* Fullscreen Modal */}
        <PostTaskModal open={openModal} onClose={() => setOpenModal(false)} />

        {selectedTask && <TaskDetails task={selectedTask} />}

        <Box
          p={2}
          display="flex"
          alignItems="center"
          bgcolor="background.paper"
          boxShadow={1}
        >
          <Paper
            component="form"
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: 300,
              mr: 4,
              p: '2px 8px',
              bgcolor: '#FFFFFF',
            }}
          >
            <SearchIcon />
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search for a task"
            />
          </Paper>

          <Tabs value={0} textColor="primary" indicatorColor="primary">
            <Tab label="All tasks" />
            <Tab label="Tasks Assigned" />
            <Tab label="Offers Pending" />
            <Tab label="Task Completed" />
          </Tabs>

          <Box ml="auto" display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                textTransform: 'none',
                bgcolor: '#1A3D8F',
                '&:hover': { bgcolor: '#163373' },
              }}
              onClick={() => setOpenModal(true)} // Trigger fullscreen modal
            >
              Post a Task
            </Button>
          </Box>
        </Box>

        <Box display="flex" flex={1} overflow="hidden">
          {/* Sidebar */}
          <Box
            width="30%"
            bgcolor="background.default"
            p={2}
            sx={{ overflowY: 'auto' }}
          >
            <Typography variant="h6" gutterBottom>
              OPEN TASKS
            </Typography>

            {tasks.map((task) => (
              <Card
                sx={{
                  mb: 2,
                  cursor: 'pointer',
                  borderColor: '#E0E0E0',
                  '&:hover': {
                    borderColor: '#1A3D8F',
                  },
                }}
                key={task._id}
                onClick={() => navigate(`/user/dashboard/task/${task._id}`)}
              >
                <CardContent>
                  <Grid container justifyContent="space-between">
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="h6" color="primary">
                      ${task.budget}
                    </Typography>
                  </Grid>
                  <Box display="flex" alignItems="center" mt={1}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {task.location?.address}
                    </Typography>
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
                      className="text-[#06D6A0] font-medium"
                      style={{
                        color:
                          task.status === 'Active'
                            ? '#FF6B6B'
                            : task.status === 'In Progress'
                            ? '#2EC4B6'
                            : '#666666',
                      }}
                    >
                      {task.status}
                      {task.bids.length > 0 && `· ${task.bids.length} offer(s)`}
                    </div>

                    {/* {task.user?._id === user.id && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteTask(task._id)
                        }}
                      >
                        Delete
                      </Button>
                    )} */}
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
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {console.log(taskMarkers)}
              {taskMarkers.map(
                (task) =>
                  task.coordinates && (
                    <Marker key={task._id} position={task.coordinates}>
                      <Popup>
                        <div className="max-w-sm bg-white rounded-xl shadow-md p-3">
                          {/* Task Image */}
                          {task.images?.length > 0 && (
                            <div className="mb-2 overflow-hidden rounded-lg">
                              <img
                                src={task.images[0]}
                                alt={task.title}
                                className="w-full h-32 object-cover rounded-md"
                              />
                            </div>
                          )}

                          {/* Title & Budget */}
                          <div className="flex justify-between mb-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {task.title}
                            </h3>
                            <p className="text-md font-medium text-primary">
                              ${task.budget}
                            </p>
                          </div>

                          {/* Location */}
                          <div className="flex items-center mb-1 text-sm text-gray-600">
                            <LocationOnIcon className="mr-1 text-primary" />
                            <p className="truncate">{task.location?.address}</p>
                          </div>

                          {/* Deadline */}
                          <div className="flex items-center mb-1 text-sm text-gray-600">
                            <EventIcon className="mr-1 text-primary" />
                            <p>
                              {new Date(task.deadline).toLocaleDateString()}
                            </p>
                          </div>

                          {/* Status */}
                          <div className="mb-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                task.status === 'Completed'
                                  ? 'bg-green-100 text-green-600'
                                  : task.status === 'Active'
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>

                          {/* View Task Button */}
                          <button
                            className="w-full py-1 mt-2 text-white bg-primary rounded-lg hover:bg-primary-dark focus:outline-none"
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
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
