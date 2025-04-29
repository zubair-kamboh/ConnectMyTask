// components/Layout.js
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
  Settings,
  Logout,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Notifications,
} from '@mui/icons-material'
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import { useEffect, useState, cloneElement, isValidElement } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const drawerWidth = 240

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const [profile, setProfile] = useState(null)

  const muiTheme = useTheme()
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
    },
  })

  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))
  const openMenu = Boolean(anchorEl)
  const navigate = useNavigate()
  const location = useLocation()

  const toggleDrawer = () => setDrawerOpen(!drawerOpen)
  const toggleTheme = () => setDarkMode(!darkMode)

  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)
  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/user/dashboard' },
    { text: 'Tasks', icon: <Assignment />, path: '/user/dashboard/tasks' },
    {
      text: 'Profile',
      icon: <AccountCircle />,
      path: '/user/dashboard/profile',
    },
    { text: 'Settings', icon: <Settings />, path: '/user/settings' },
    { text: 'Logout', icon: <Logout />, action: handleLogout },
  ]

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        const id = JSON.parse(user).id
        const res = await fetch(
          `http://localhost:3300/api/auth/profile/${id}`,
          {
            headers: { Authorization: `${token}` },
          }
        )
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
        >
          <Toolbar>
            <IconButton color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              ConnectMyTask
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton onClick={toggleTheme} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <IconButton onClick={handleAvatarClick} color="inherit">
              <Avatar
                src={profile?.profilePhoto}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                  navigate('/user/dashboard/profile')
                }}
              >
                Account
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
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
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {drawerOpen && <ListItemText primary={item.text} />}
                </ListItem>
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
