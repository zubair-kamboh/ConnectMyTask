'use client'

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'

export default function Navbar() {
  const theme = useTheme()

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: theme.palette.primary.contrastText,
            fontWeight: 'bold',
          }}
        >
          ConnectMyTask
        </Typography>

        {/* Menu button (mobile view) - optional */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Navigation links (desktop view) */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button component={Link} href="/" color="inherit">
            Home
          </Button>
          <Button component={Link} href="/register" color="inherit">
            Register
          </Button>
          <Button component={Link} href="/login" color="inherit">
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
