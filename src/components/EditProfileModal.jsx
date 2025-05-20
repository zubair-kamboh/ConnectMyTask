import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Avatar,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import PlaceAutoComplete from './PlaceAutoComplete' // Adjust the import path as needed

export default function EditProfileModal({ open, onClose, profile, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePhoto: '',
    location: {
      address: '',
      lat: null,
      lng: null,
    },
  })
  const [previewPhoto, setPreviewPhoto] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        profilePhoto: profile.profilePhoto || '',
        location: {
          address: profile.location?.address || '',
          lat: profile.location?.lat,
          lng: profile.location?.lng,
        },
      })
      setPreviewPhoto(profile.profilePhoto || '')
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'address') {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, address: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPreviewPhoto(URL.createObjectURL(file))
      setFormData((prev) => ({ ...prev, profilePhoto: file }))
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const form = new FormData()
      form.append('name', formData.name)
      form.append('email', formData.email)
      form.append('location.address', formData.location.address || '')
      if (formData.location.lat !== null) {
        form.append('location.lat', formData.location.lat.toString())
      }
      if (formData.location.lng !== null) {
        form.append('location.lng', formData.location.lng.toString())
      }
      if (formData.profilePhoto instanceof File) {
        form.append('profilePhoto', formData.profilePhoto)
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
      onSave(res.data)
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent
        sx={{
          px: 4,
          py: 3,
          bgcolor: 'background.paper',
          borderRadius: 3,
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h5"
          sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold' }}
        >
          Edit Profile
        </Typography>

        <Box textAlign="center" mb={3}>
          <Avatar
            src={previewPhoto}
            alt="Profile"
            sx={{
              width: 90,
              height: 90,
              mx: 'auto',
              border: '3px solid #1e88e5',
              boxShadow: 3,
            }}
          />
          <Typography variant="body2" mt={1}>
            Upload a new profile photo
          </Typography>
          <Button
            variant="outlined"
            component="label"
            size="small"
            sx={{ mt: 1 }}
          >
            Choose File
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
          sx={{ mb: 3 }}
          value={formData.email}
          disabled
        />

        {/* Add the PlaceAutoComplete component */}
        <PlaceAutoComplete
          value={formData.location.address}
          onPlaceSelect={(place) => {
            const address = place?.formatted_address || ''
            const lat = place?.geometry?.location?.lat()
            const lng = place?.geometry?.location?.lng()
            setFormData((prev) => ({
              ...prev,
              location: { address, lat, lng },
            }))
          }}
        />

        <Box
          mt={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ px: 4, py: 1.2, fontWeight: 'bold', borderRadius: 999 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
