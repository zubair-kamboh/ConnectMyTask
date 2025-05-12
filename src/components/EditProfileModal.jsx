import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Avatar,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function EditProfileModal({ open, onClose, profile, onSave }) {
  const [formData, setFormData] = useState({})
  const [previewPhoto, setPreviewPhoto] = useState('')
  const [loading, setLoading] = useState(false)
  console.log(profile)
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',

        profilePhoto: profile.profilePhoto || '',
      })
      setPreviewPhoto(profile.profilePhoto || '')
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPreviewPhoto(URL.createObjectURL(file))
      setFormData((prev) => ({ ...prev, profilePhoto: file })) // Save File object
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')

      // Prepare form data
      const form = new FormData()
      form.append('name', formData.name)
      form.append('email', formData.email)
      form.append('state', formData.state)
      form.append('city', formData.city)
      form.append('suburb', formData.suburb)
      form.append('skills', formData.skills)
      if (formData.profilePhoto instanceof File) {
        form.append('profilePhoto', formData.profilePhoto) // actual file
      }

      const res = await axios.put(
        `http://localhost:3300/api/auth/profile/${profile._id}`,
        form,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      toast.success('Profile updated successfully!')
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error(error)
      toast.error('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent dividers>
        <Box textAlign="center" mb={2}>
          <Avatar
            src={previewPhoto}
            alt="Profile Photo"
            sx={{ width: 80, height: 80, margin: 'auto' }}
          />
          <Typography variant="body2" mt={1}>
            Click to upload a new photo
          </Typography>
          <Button
            variant="outlined"
            component="label"
            size="small"
            sx={{ mt: 1 }}
          >
            Upload Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoUpload}
            />
          </Button>
        </Box>

        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          disabled
          value={formData.email}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Save Changes'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
