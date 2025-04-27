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
  Switch,
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

const DefaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
})
L.Marker.prototype.options.icon = DefaultIcon

export default function TaskMapUI() {
  const [openModal, setOpenModal] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [tasks, setTasks] = useState([])
  const [taskMarkers, setTaskMarkers] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const token = localStorage.getItem('token')

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  )

  // Fetch tasks immediately
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3300/api/tasks', {
          headers: {
            Authorization: `${token}`,
          },
        })

        setTasks(response.data) // set tasks immediately

        // Geocode locations separately
        const tasksWithCoords = await Promise.all(
          response.data.map(async (task) => {
            const coords = await geoCodeLocations(
              task.location.suburb,
              task.location.city,
              task.location.state
            )
            return {
              ...task,
              coordinates: coords,
            }
          })
        )

        setTaskMarkers(tasksWithCoords) // set markers after geocoding
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }

    fetchTasks()
  }, [token])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box height="100vh" display="flex" flexDirection="column">
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
            <Typography variant="body2">Dark Mode</Typography>
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
              onClick={() => setOpenModal(true)}
            >
              Post a Task
            </Button>
          </Box>
        </Box>

        {/* Content */}
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
                sx={{ mb: 2 }}
                key={task._id}
                onClick={() => setSelectedTask(task)}
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
                      {task.location?.suburb} {task.location?.state}
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
                    <Typography variant="body2">Flexible</Typography>
                  </Box>
                  <Box mt={2}>
                    <Button variant="text" color="primary">
                      Open
                    </Button>
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

              {taskMarkers.map(
                (task) =>
                  task.coordinates && (
                    <Marker key={task._id} position={task.coordinates}>
                      <Popup>
                        <Card
                          sx={{
                            p: 2,
                            width: 260,
                            boxShadow: 3,
                            borderRadius: 3,
                            bgcolor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'grey.900'
                                : 'background.paper',
                            color: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'grey.100'
                                : 'text.primary',
                          }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            mb={2}
                          >
                            <Avatar sx={{ width: 56, height: 56 }} />
                            <Box
                              textAlign="center"
                              px={2}
                              py={1}
                              borderRadius={2}
                              bgcolor={(theme) =>
                                theme.palette.mode === 'dark'
                                  ? 'primary.dark'
                                  : 'primary.light'
                              }
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary' }}
                              >
                                EARN
                              </Typography>
                              <Typography
                                variant="h6"
                                color="primary.contrastText"
                              >
                                ${task.budget}
                              </Typography>
                            </Box>
                          </Box>

                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            gutterBottom
                          >
                            {task.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === 'dark'
                                  ? 'grey.400'
                                  : 'text.secondary',
                            }}
                          >
                            Due: {new Date(task.deadline).toLocaleDateString()}
                          </Typography>

                          <Button
                            onClick={() => setSelectedTask(task)}
                            variant="contained"
                            fullWidth
                            sx={{
                              mt: 2,
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                              borderRadius: 10,
                              textTransform: 'none',
                              '&:hover': {
                                bgcolor: 'primary.dark',
                              },
                            }}
                          >
                            View Task
                          </Button>
                        </Card>
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
