'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// MUI imports
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
} from '@mui/material'
import Footer from '@/components/footer'

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const parsedUser = JSON.parse(user)
      if (parsedUser.role === 'user') {
        router.push('/user/dashboard')
      } else if (parsedUser.role === 'provider') {
        router.push('/provider/dashboard')
      }
    }
  }, [router])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:3300/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        toast.success('Login successful!')
        if (data.user.role === 'user') {
          router.push('/user/dashboard')
        } else if (data.user.role === 'provider') {
          router.push('/provider/dashboard')
        }
      } else {
        toast.error(data.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('There was an error during login. Please try again.')
    }
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f3f4f6"
        px={2}
      >
        <Card
          sx={{
            maxWidth: 400,
            width: '100%',
            p: 3,
            borderRadius: 4,
            boxShadow: 4,
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              fontWeight="bold"
              textAlign="center"
              mb={3}
            >
              Login
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="small"
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
                >
                  Login
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" textAlign="center" mt={3}>
              Don't have an account?{' '}
              <Link
                href="/register"
                style={{
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Register
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </>
  )
}
