import { useEffect, useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material'

import {
  Dashboard,
  Assignment,
  AccountCircle,
  Settings,
  Logout,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Notifications,
} from '@mui/icons-material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { ListItemButton } from '@mui/material'
import ProfilePage from '../components/ProfilePage'
import TasksPage from '../components/TaskPage'

export default function DashboardLayout() {
  const [darkMode, setDarkMode] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [selectedPage, setSelectedPage] = useState('Dashboard')
  const [profile, setProfile] = useState(() => {
    const storedProfile = localStorage.getItem('profile')
    return storedProfile ? JSON.parse(storedProfile) : null
  })
  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = localStorage.getItem('user') // Assuming you saved it like this
        const token = localStorage.getItem('token')
        const id = JSON.parse(user).id
        const response = await fetch(
          `http://localhost:3300/api/auth/profile/${id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }

        const data = await response.json()
        localStorage.setItem('providerProfile', JSON.stringify(data))
        setProfile(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()
  }, [])
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
    },
  })

  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/login'
  }

  const drawerWidth = 240

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard /> },
    { text: 'Tasks', icon: <Assignment /> },
    { text: 'Profile', icon: <AccountCircle /> },
    { text: 'Settings', icon: <Settings /> },
    { text: 'Logout', icon: <Logout /> },
  ]

  const renderContent = () => {
    if (selectedPage === 'Profile') {
      return (
        <ProfilePage profile={profile} onEdit={() => alert('Coming soon...')} />
      )
    }

    if (selectedPage === 'Tasks') {
      return <TasksPage />
    }

    return (
      <motion.div
        key={selectedPage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <Typography variant="h4" gutterBottom>
          {selectedPage}
        </Typography>
      </motion.div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              ConnectMyTask
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={toggleTheme}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <IconButton onClick={handleAvatarClick} color="inherit">
              <Avatar
                alt={profile?.name || 'User'}
                src={profile?.profilePhoto}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => setSelectedPage('Profile')}>
                Account
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Side Drawer */}
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            width: drawerOpen ? drawerWidth : 56,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerOpen ? drawerWidth : 56,
              boxSizing: 'border-box',
              transition: 'width 0.3s',
              overflowX: 'hidden',
            },
          }}
        >
          <Toolbar />
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem disablePadding key={item.text}>
                <ListItemButton
                  selected={selectedPage === item.text}
                  onClick={() => {
                    setSelectedPage(item.text)
                    if (isMobile) toggleDrawer()
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {drawerOpen && <ListItemText primary={item.text} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 56}px)` },
            // mt: 8,
            transition: 'margin-left 0.3s',
          }}
        >
          {renderContent()}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          p: 2,
          backgroundColor: theme.palette.background.paper,
          mt: 'auto',
        }}
      >
        <Typography variant="body2">
          ConnectMyTask &copy; {new Date().getFullYear()}
        </Typography>
      </Box>
    </ThemeProvider>
  )
}
