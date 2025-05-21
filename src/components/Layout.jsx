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
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
} from '@mui/material'
import {
  Dashboard,
  Assignment,
  AccountCircle,
  Logout,
  Menu as MenuIcon,
  Notifications,
  Message,
} from '@mui/icons-material'
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import { useDarkMode } from '../context/ThemeContext'

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { useAuth } from '../context/AuthContext'
import LanguageSwitcher from './LanguageSwitcher'
import logo from '../asset/PNG/connectmytask_logo.png'

const drawerWidth = 240

const Layout = ({ children }) => {
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const [profile, setProfile] = useState(null)
  const muiTheme = useTheme()
  const { logout } = useAuth()
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1A3D8F' },
      secondary: { main: '#06D6A0' },
    },
  })

  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))
  const openMenu = Boolean(anchorEl)
  const navigate = useNavigate()
  const location = useLocation()

  const toggleDrawer = () => setDrawerOpen(!drawerOpen)
  const toggleTheme = () => {
    const newMode = !darkMode
    // setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode)
    document.documentElement.classList.toggle('dark', newMode)
  }

  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/user/dashboard' },
    { text: 'Tasks', icon: <Assignment />, path: '/user/dashboard/tasks' },
    {
      text: 'Profile',
      icon: <AccountCircle />,
      path: '/user/dashboard/profile',
    },
    { text: 'Messages', icon: <Message />, path: '/user/messages' },
    { text: 'Logout', icon: <Logout />, action: handleLogout },
  ]

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  // useEffect(() => {
  //   const stored = localStorage.getItem('darkMode')
  //   const initialMode = stored !== null ? stored === 'true' : prefersDarkMode
  //   setDarkMode(initialMode)
  //   document.documentElement.classList.toggle('dark', initialMode)
  // }, [prefersDarkMode])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        const id = JSON.parse(user).id
        const res = await fetch(`/api/auth/profile/${id}`, {
          headers: { Authorization: `${token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch profile')
        const data = await res.json()
        setProfile(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
    fetchProfile()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          className="bg-[#1A3D8F]"
          elevation={2}
        >
          <Toolbar className="gap-4 px-4">
            <IconButton
              color="inherit"
              onClick={toggleDrawer}
              sx={{ p: 1.5, borderRadius: 2 }}
            >
              <MenuIcon fontSize="medium" />
            </IconButton>

            {/* <img
              component={NavLink}
              to={'#'}
              variant="h6"
              src={logo}
              sx={{ width: '20px', height: '20px' }}
              className="text-white font-bold tracking-wide"
            /> */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <NavLink to="/user/dashboard" style={{ display: 'inline-block' }}>
                <img
                  src={logo}
                  alt="ConnectMyTask Logo"
                  style={{ height: '40px', objectFit: 'contain' }}
                />
              </NavLink>
            </Box>

            <Box className="flex gap-3 items-center">
              <IconButton
                color="inherit"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  p: 1.2,
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
              >
                <Badge badgeContent={4} color="error">
                  <Notifications fontSize="medium" />
                </Badge>
              </IconButton>

              <DarkModeToggleButton />
              <LanguageSwitcher />
              <IconButton
                onClick={handleAvatarClick}
                sx={{
                  p: 0.5,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  '&:hover': { borderColor: '#fff' },
                }}
              >
                <Avatar
                  src={profile?.profilePhoto}
                  sx={{ width: 36, height: 36 }}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    minWidth: 160,
                    boxShadow: 3,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose()
                    navigate('/user/dashboard/profile')
                  }}
                >
                  <AccountCircle sx={{ mr: 1 }} />
                  Account
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Drawer */}
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            width: drawerOpen ? drawerWidth : 56,
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
                <ListItem
                  button
                  selected={location.pathname === item.path}
                  onClick={() => {
                    item.action ? item.action() : navigate(item.path)
                    if (isMobile) toggleDrawer()
                  }}
                  sx={{
                    py: 1.5,
                    px: drawerOpen ? 2 : 1,
                    mx: 1,
                    my: 0.5,
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'white',
                      '& .MuiListItemIcon-root': { color: 'white' },
                    },
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '& .MuiListItemIcon-root': { color: 'white' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                  {drawerOpen && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  )}
                </ListItem>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          className="flex-grow p-3 bg-[#F9FAFB] dark:bg-gray-900 dark:text-white"
          sx={{
            width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 56}px)` },
          }}
        >
          <Toolbar />
          {/* Pass profile to children */}
          {children && typeof children.type === 'function'
            ? children.type({ ...children.props, profile })
            : children}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default Layout

const DarkModeToggleButton = () => {
  const { darkMode, toggleDarkMode } = useDarkMode()

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs md:text-sm hidden md:inline">
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </span>
      <button
        onClick={toggleDarkMode}
        className={`w-14 h-8 flex items-center rounded-full px-1 transition duration-300 ${
          darkMode ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        aria-label="Toggle Dark Mode"
      >
        <div
          className={`w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transform transition-transform duration-300 ${
            darkMode ? 'translate-x-6' : 'translate-x-0'
          }`}
        >
          {darkMode ? (
            <LightModeOutlinedIcon
              fontSize="small"
              className="text-yellow-400"
            />
          ) : (
            <DarkModeOutlinedIcon fontSize="small" className="text-blue-900" />
          )}
        </div>
      </button>
    </div>
  )
}
