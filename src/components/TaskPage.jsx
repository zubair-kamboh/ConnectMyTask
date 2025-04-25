import React, { useState, useMemo } from 'react'
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
  IconButton,
  useTheme,
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

const DefaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
})
L.Marker.prototype.options.icon = DefaultIcon

const taskData = [
  {
    id: 1,
    title: 'Help move my sofa',
    price: 50,
    location: 'Hadfield VIC',
    time: 'Afternoon',
    date: 'Flexible',
    position: [-37.705, 144.961],
    due: 'Due in 29 days',
    poster: 'Zubair A.',
    posted: 'about 1 hour ago',
  },
  {
    id: 2,
    title: 'Clean my backyard',
    price: 75,
    location: 'Brunswick VIC',
    time: 'Morning',
    date: 'Tomorrow',
    position: [-37.765, 144.963],
    due: 'Due in 3 days',
    poster: 'Sarah K.',
    posted: '2 hours ago',
  },
  {
    id: 3,
    title: 'Assemble flat-pack furniture',
    price: 90,
    location: 'Northcote VIC',
    time: 'Evening',
    date: 'Next Monday',
    position: [-37.774, 144.998],
    due: 'Due in 5 days',
    poster: 'John D.',
    posted: '5 hours ago',
  },
]

export default function TaskMapUI() {
  const [openModal, setOpenModal] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box height="100vh" display="flex" flexDirection="column">
        <PostTaskModal open={openModal} onClose={() => setOpenModal(false)} />

        {/* Top bar */}
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
        <Box display="flex" flex={1}>
          {/* Sidebar */}
          <Box
            width="30%"
            bgcolor="background.default"
            p={2}
            overflow="auto"
            color="text.primary"
          >
            <Typography variant="h6" gutterBottom>
              OPEN TASKS
            </Typography>

            {taskData.map((task) => (
              <Card sx={{ mb: 2 }} key={task.id}>
                <CardContent>
                  <Grid container justifyContent="space-between">
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="h6" color="primary">
                      ${task.price}
                    </Typography>
                  </Grid>
                  <Box display="flex" alignItems="center" mt={1}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{task.location}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mt={1}>
                    <EventIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{task.date}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mt={1}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{task.time}</Typography>
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
              center={[-37.74, 144.98]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {taskData.map((task) => (
                <Marker key={task.id} position={task.position}>
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
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === 'dark'
                                  ? 'grey.300'
                                  : 'text.secondary',
                            }}
                          >
                            EARN
                          </Typography>
                          <Typography variant="h6" color="primary.contrastText">
                            ${task.price}
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
                        {task.due}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          color: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'grey.400'
                              : 'text.secondary',
                        }}
                      >
                        Posted by{' '}
                        <Typography
                          component="span"
                          sx={{ color: 'primary.main', fontWeight: 500 }}
                        >
                          {task.poster}
                        </Typography>{' '}
                        {task.posted}
                      </Typography>

                      <Button
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
              ))}
            </MapContainer>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
