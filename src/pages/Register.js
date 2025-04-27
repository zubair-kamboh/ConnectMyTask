import { useState } from 'react'
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
import { Link, NavLink } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import Footer from '../components/Footer'
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
    location: {
      state: '',
      city: '',
      suburb: '',
    },
    skills: [],
    profilePhoto: null,
  })
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSkillAdd = () => {
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

    setLoading(true)

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('email', form.email)
    formData.append('password', form.password)
    formData.append('role', form.role)
    formData.append('profilePhoto', form.profilePhoto)

    formData.append('location.state', form.location.state)
    formData.append('location.city', form.location.city)
    formData.append('location.suburb', form.location.suburb)

    if (form.skills.length > 0) {
      formData.append('skills', form.skills.join(','))
    }

    try {
      const res = await fetch(`http://localhost:3300/api/auth/register`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        toast.success('Registered successfully!')
      } else {
        toast.error(data.msg || 'Registration failed')
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
      <Container maxWidth="sm">
        <ToastContainer />
        {loading && <Loader fullScreen />}

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

          <form onSubmit={handleSubmit}>
            <Stack spacing={3} mt={4}>
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

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="State"
                    name="state"
                    value={form.location.state}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        location: { ...form.location, state: e.target.value },
                      })
                    }
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="City"
                    name="city"
                    value={form.location.city}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        location: { ...form.location, city: e.target.value },
                      })
                    }
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Suburb"
                    name="suburb"
                    value={form.location.suburb}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        location: { ...form.location, suburb: e.target.value },
                      })
                    }
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <TextField
                  label="Add Skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  fullWidth
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleSkillAdd()
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.preventDefault()
                    handleSkillAdd()
                  }}
                >
                  Add
                </Button>
              </Box>

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
                Already have an account? <NavLink to={'/login'}>Login</NavLink>
              </Typography>
            </Stack>
          </form>
        </Box>
      </Container>
      <Footer />
    </>
  )
}
