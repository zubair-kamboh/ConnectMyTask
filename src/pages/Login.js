import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
} from '@mui/material'
import Loader from '../components/Loader'
import Footer from '../components/Footer'
import { NavLink } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`http://localhost:3300/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        toast.success('Login successful!')
        window.location.href = '/dashboard' // Redirect to dashboard
      } else {
        toast.error(data.msg || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Server error, try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer />
      {loading && <Loader fullScreen />}
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 10,
            p: 4,
            boxShadow: 3,
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            color="primary"
            fontWeight="bold"
          >
            Welcome Back
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3} mt={4}>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                fullWidth
              />

              <Button variant="contained" type="submit" size="large" fullWidth>
                Login
              </Button>

              <Typography
                textAlign="center"
                variant="body2"
                color="textSecondary"
              >
                Don't have an account?{' '}
                <NavLink to="/register">Register</NavLink>
              </Typography>
            </Stack>
          </form>
        </Box>
      </Container>
      <Footer />
    </>
  )
}
