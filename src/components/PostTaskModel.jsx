import React, { useState } from 'react'
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Divider,
  useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import Loader from './Loader'
import { toast } from 'react-toastify'

const steps = [
  'Title',
  'Description',
  'Budget',
  'Deadline',
  'Location',
  'Images',
  'Category',
]

const categories = [
  'Cleaning',
  'Plumbing',
  'Electrical',
  'Handyman',
  'Moving',
  'Delivery',
  'Gardening',
  'Tutoring',
  'Tech Support',
  'Other',
]

export default function PostTaskModal({ open, onClose }) {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const [formStep, setFormStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    location: {
      state: '',
      city: '',
      suburb: '',
    },
    images: [],
    category: '',
  })

  const resetForm = () => {
    setFormStep(0)
    setFormData({
      title: '',
      description: '',
      budget: '',
      deadline: '',
      location: { state: '', city: '', suburb: '' },
      images: [],
      category: '',
    })
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === 'images') {
      setFormData({ ...formData, images: Array.from(files).slice(0, 3) })
    } else if (['state', 'city', 'suburb'].includes(name)) {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [name]: value,
        },
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const taskData = new FormData()

    Object.entries(formData).forEach(([key, val]) => {
      if (key === 'images') {
        val.forEach((file) => taskData.append('images', file))
      } else if (key === 'location') {
        Object.entries(val).forEach(([locKey, locVal]) => {
          taskData.append(`location.${locKey}`, locVal)
        })
      } else {
        taskData.append(key, val)
      }
    })

    try {
      await axios.post('http://localhost:3300/api/tasks', taskData, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Task posted successfully!')
      resetForm()
      onClose()
    } catch (err) {
      toast.error('Failed to post task. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (formStep) {
      case 0:
        return (
          <TextField
            fullWidth
            label="What do you need done?"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Help move my sofa"
            sx={{ mt: 3 }}
            InputLabelProps={{ sx: { fontSize: 18 } }}
            inputProps={{ style: { fontSize: 18 } }}
          />
        )
      case 1:
        return (
          <TextField
            fullWidth
            label="Describe your task in detail"
            name="description"
            multiline
            rows={5}
            value={formData.description}
            onChange={handleChange}
            sx={{ mt: 3 }}
            InputLabelProps={{ sx: { fontSize: 18 } }}
            inputProps={{ style: { fontSize: 16 } }}
          />
        )
      case 2:
        return (
          <TextField
            fullWidth
            label="Your budget (in $)"
            name="budget"
            type="number"
            value={formData.budget}
            onChange={handleChange}
            sx={{ mt: 3 }}
            InputLabelProps={{ sx: { fontSize: 18 } }}
            inputProps={{ style: { fontSize: 18 } }}
          />
        )
      case 3:
        return (
          <TextField
            fullWidth
            label="When is the deadline?"
            name="deadline"
            type="date"
            InputLabelProps={{ shrink: true, sx: { fontSize: 18 } }}
            inputProps={{ style: { fontSize: 18 } }}
            value={formData.deadline}
            onChange={handleChange}
            sx={{ mt: 3 }}
          />
        )
      case 4:
        return (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {['state', 'city', 'suburb'].map((field) => (
              <Grid item xs={12} key={field}>
                <TextField
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={formData.location[field]}
                  onChange={handleChange}
                  InputLabelProps={{ sx: { fontSize: 18 } }}
                  inputProps={{ style: { fontSize: 18 } }}
                />
              </Grid>
            ))}
          </Grid>
        )
      case 5:
        return (
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 3, p: 2, fontSize: 16 }}
          >
            Upload Images (Max 3)
            <input
              hidden
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleChange}
            />
          </Button>
        )
      case 6:
        return (
          <TextField
            fullWidth
            select
            label="Select a category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            sx={{ mt: 3 }}
            InputLabelProps={{ sx: { fontSize: 18 } }}
            inputProps={{ style: { fontSize: 18 } }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        )
      default:
        return null
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          bgcolor: isDarkMode ? 'background.default' : '#f9f9fb',
          color: isDarkMode ? 'text.primary' : 'inherit',
        }}
      >
        {/* Sidebar */}
        <Box
          width="20%"
          bgcolor={isDarkMode ? 'background.paper' : '#fff'}
          p={4}
          boxShadow={2}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Create Task
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stepper activeStep={formStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  onClick={() => setFormStep(index)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography fontSize={16}>{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Main */}
        <Box
          flex={1}
          p={5}
          position="relative"
          bgcolor={isDarkMode ? 'background.default' : '#f9f9fb'}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4" fontWeight="bold">
              {steps[formStep]}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon fontSize="large" />
            </IconButton>
          </Box>

          {renderStep()}

          <Box
            display="flex"
            justifyContent="space-between"
            mt={5}
            position="absolute"
            bottom={40}
            left={40}
            right={40}
          >
            <Button
              variant="outlined"
              disabled={formStep === 0}
              onClick={() => setFormStep((prev) => prev - 1)}
              sx={{ px: 4, py: 1.5, fontSize: 16 }}
            >
              Back
            </Button>
            {formStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={() => setFormStep((prev) => prev + 1)}
                sx={{ px: 4, py: 1.5, fontSize: 16 }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ px: 4, py: 1.5, fontSize: 16 }}
              >
                Submit Task
              </Button>
            )}
          </Box>

          {loading && <Loader fullScreen />}
        </Box>
      </Box>
    </Modal>
  )
}
