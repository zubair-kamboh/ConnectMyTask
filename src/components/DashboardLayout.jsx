import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Tooltip,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Brightness4,
  Brightness7,
  Dashboard,
  People,
  Settings,
} from '@mui/icons-material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const drawerWidth = 240

const DashboardLayout = ({ children }) => {
  const theme = useTheme()
  const [darkMode, setDarkMode] = useState(false)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [open, setOpen] = useState(!isMobile)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user')) || {}
  const { name, role } = user

  const toggleDrawer = () => setOpen(!open)
  const toggleTheme = () => setDarkMode(!darkMode)

  const navItems = [
    { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    ...(role === 'provider'
      ? [{ label: 'Manage Users', icon: <People />, path: '/users' }]
      : [{ label: 'Profile', icon: <Settings />, path: '/profile' }]),
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1976D2', // Primary color for consistency
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: 'block' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {role === 'provider' ? 'Provider Dashboard' : 'User Dashboard'}
          </Typography>

          <IconButton color="inherit" onClick={toggleTheme}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>

          <Tooltip title={name}>
            <Avatar sx={{ ml: 2, backgroundColor: '#1565C0' }}>
              {name?.charAt(0)}
            </Avatar>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1976D2', // Matching the AppBar color
          },
        }}
      >
        <Toolbar />
        <List>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: '#1565C0', // Hover effect matching AppBar color
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  )
}

export default DashboardLayout
