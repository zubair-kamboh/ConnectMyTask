import {
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  Divider,
  Grid,
} from '@mui/material'
import EditProfileModal from './EditProfileModal'
import { useState } from 'react'

export default function ProfilePage({ profile, onEdit }) {
  const [isEditOpen, setEditOpen] = useState(false)
  const [updatedProfile, setUpdatedProfile] = useState(profile)

  const handleEdit = (newData) => {
    setUpdatedProfile(newData)
    // Optional: send update to API
  }

  if (!profile) return null

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: 'auto', mt: 14 }}>
      <Box display="flex" alignItems="center" gap={3}>
        <Avatar
          src={profile.profilePhoto}
          alt={profile.name}
          sx={{ width: 80, height: 80 }}
        />
        <Box>
          <Typography variant="h5">{profile.name}</Typography>
          <Typography color="textSecondary">{profile.email}</Typography>
          <Typography variant="body2">Role: {profile.role}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle2">User ID</Typography>
          <Typography>{profile._id}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Location</Typography>
          <Typography>
            {`${profile.location.suburb} 
              ${profile.location.city} 
              ${profile.location.state}` || 'N/A'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Registered On</Typography>
          <Typography>
            {new Date(profile.createdAt).toLocaleDateString()}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Verified</Typography>
          <Typography>{profile.isVerified ? 'Yes' : 'No'}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Skills</Typography>
          <Typography>{profile.skills?.join(', ') || 'N/A'}</Typography>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        onClick={() => {
          setUpdatedProfile(profile) // <-- Make sure it's the latest data
          setEditOpen(true)
        }}
      >
        Edit Profile
      </Button>

      <EditProfileModal
        open={isEditOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
        onSave={handleEdit}
      />
    </Paper>
  )
}
