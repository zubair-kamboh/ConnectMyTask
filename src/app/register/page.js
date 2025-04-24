'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Chip,
  Stack,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const Input = styled('input')({
  display: 'none',
})

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    location: '',
    skills: [],
    profilePhoto: null,
  })
  const [skillInput, setSkillInput] = useState('')
  const router = useRouter()

  // useEffect(() => {
  //   const user = localStorage.getItem('user')
  //   if (user) {
  //     const parsedUser = JSON.parse(user)
  //     if (parsedUser.role === 'user') {
  //       router.push('/user/dashboard')
  //     } else if (parsedUser.role === 'provider') {
  //       router.push('/provider/dashboard')
  //     }
  //   }
  // }, [router])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSkillAdd = (e) => {
    e.preventDefault()
    if (skillInput && !form.skills.includes(skillInput)) {
      setForm({ ...form, skills: [...form.skills, skillInput] })
      setSkillInput('')
    }
  }

  const handleSkillDelete = (skillToDelete) => {
    setForm({
      ...form,
      skills: form.skills.filter((skill) => skill !== skillToDelete),
    })
  }

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, profilePhoto: e.target.files[0] })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords don't match. Please try again.")
      return
    }

    // API call will be added later
    console.log('Form Data:', form)
  }

  return (
    <>
      <Container maxWidth="sm">
        <ToastContainer />
        <Box
          sx={{
            mt: 8,
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
            Create Your Account
          </Typography>

          <Box onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Stack spacing={3}>
              <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                fullWidth
              />

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
                label="Create Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={form.role}
                  label="Role"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="provider">Provider</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                fullWidth
                placeholder="e.g., Melbourne"
              />

              <Box>
                <form
                  onSubmit={handleSkillAdd}
                  style={{ display: 'flex', gap: '8px' }}
                >
                  <TextField
                    label="Add Skill"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    fullWidth
                  />
                  <Button variant="contained" type="submit">
                    Add
                  </Button>
                </form>
                <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                  {form.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={() => handleSkillDelete(skill)}
                      color="primary"
                    />
                  ))}
                </Stack>
              </Box>

              <Box>
                <label htmlFor="profilePhoto">
                  <Input
                    accept="image/*"
                    id="profilePhoto"
                    type="file"
                    onChange={handlePhotoChange}
                  />
                  <Button variant="outlined" component="span" fullWidth>
                    {form.profilePhoto
                      ? form.profilePhoto.name
                      : 'Upload Profile Photo'}
                  </Button>
                </label>
              </Box>

              <Button variant="contained" type="submit" size="large" fullWidth>
                Register
              </Button>

              <Typography
                textAlign="center"
                variant="body2"
                color="textSecondary"
              >
                Already have an account?{' '}
                <Link
                  href="/login"
                  style={{ color: '#1976d2', textDecoration: 'none' }}
                >
                  Login
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  )
}
