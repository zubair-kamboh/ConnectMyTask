import { useState, useRef, useEffect } from 'react'
import { Box, Modal, useTheme } from '@mui/material'
import Loader from './Loader'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useMapsLibrary } from '@vis.gl/react-google-maps'

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

export default function PostTaskModal({ open, onClose, taskToEdit = null }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    locationType: 'remote',
    locationDetails: {
      address: '',
      lat: null,
      lng: null,
    },
    images: [],
    category: '',
  })

  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        budget: taskToEdit.budget || '',
        deadline: taskToEdit.deadline?.split('T')[0] || '',
        locationType: taskToEdit.location?.type || 'remote',
        locationDetails: {
          address: taskToEdit.location?.address || '',
          lat: taskToEdit.location?.lat || null,
          lng: taskToEdit.location?.lng || null,
        },
        images: [], // Leave empty; don't preload URLs
        category: taskToEdit.category || '',
      })
    }
  }, [taskToEdit])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'images') {
      setFormData({ ...formData, images: Array.from(files).slice(0, 3) })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const taskData = new FormData()

    const locationPayload =
      formData.locationType === 'remote'
        ? { type: 'remote' }
        : {
            type: 'physical',
            address: formData.locationDetails.address,
            lat: formData.locationDetails.lat,
            lng: formData.locationDetails.lng,
          }

    taskData.append('location', JSON.stringify(locationPayload))

    Object.entries(formData).forEach(([key, val]) => {
      if (key === 'images') {
        val.forEach((file) => taskData.append('images', file))
      } else {
        taskData.append(key, val)
      }
    })

    try {
      if (taskToEdit) {
        const updateData = new FormData()

        updateData.append('title', formData.title)
        updateData.append('description', formData.description)
        updateData.append('budget', formData.budget)
        updateData.append('deadline', formData.deadline)
        updateData.append('category', formData.category)

        const locationPayload =
          formData.locationType === 'remote'
            ? { type: 'remote' }
            : {
                type: 'physical',
                address: formData.locationDetails.address,
                lat: formData.locationDetails.lat,
                lng: formData.locationDetails.lng,
              }

        updateData.append('location', JSON.stringify(locationPayload))

        await axios.put(`/api/tasks/${taskToEdit._id}`, updateData, {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        toast.success('Task updated successfully!')
      } else {
        await axios.post('/api/tasks', taskData, {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        toast.success('Task posted successfully!')
      }

      onClose()
    } catch (err) {
      toast.error('Failed to submit task. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex justify-center items-center h-screen bg-black bg-opacity-50 overflow-y-auto px-4">
        <Box
          sx={{
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: isDarkMode ? '#2e2e2e' : '#f0f0f0',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isDarkMode ? '#555' : '#c1c1c1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: isDarkMode ? '#888' : '#a0a0a0',
            },
            scrollbarWidth: 'thin',
            scrollbarColor: isDarkMode ? '#555 #2e2e2e' : '#c1c1c1 #f0f0f0',
          }}
          className="relative z-[999] w-full max-w-2xl p-6 md:p-8 bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {taskToEdit ? 'Edit Task' : 'Post a Task'}
            </h3>
            <button
              onClick={onClose}
              className="text-3xl text-primary hover:text-primaryDark transform hover:scale-125 transition"
            >
              &times;
            </button>
          </div>

          <div className="space-y-5">
            {/* Title */}
            <InputField
              label="What do you need done?"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Help move my sofa"
            />

            {/* Description */}
            <TextareaField
              label="Describe your task in detail"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. I need help moving furniture"
            />

            {/* Budget */}
            <InputField
              label="Your budget (in $)"
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
            />

            {/* Deadline */}
            <InputField
              label="When is the deadline?"
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />

            {/* Location Type */}
            <SelectField
              label="Location Type"
              name="locationType"
              value={formData.locationType}
              onChange={(e) =>
                setFormData({ ...formData, locationType: e.target.value })
              }
              options={[
                { label: 'Remote', value: 'remote' },
                { label: 'Physical', value: 'physical' },
              ]}
            />

            {/* Address for Physical Location */}
            {formData.locationType === 'physical' && (
              <div>
                <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <PlaceAutocomplete
                  onPlaceSelect={(place) => {
                    const address = place?.formatted_address || ''
                    const lat = place?.geometry?.location?.lat()
                    const lng = place?.geometry?.location?.lng()
                    setFormData((prev) => ({
                      ...prev,
                      locationDetails: { address, lat, lng },
                    }))
                  }}
                />
              </div>
            )}

            {/* Images Upload */}
            <div>
              <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Upload images (Max 3)
              </label>
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="file-upload"
                  className="w-full max-w-sm p-3 text-center text-white bg-primary hover:bg-primaryDark rounded-md cursor-pointer transition"
                >
                  Click to Upload
                  <input
                    id="file-upload"
                    hidden
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
                {formData.images.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {formData.images.map((file, index) => (
                      <div
                        key={index}
                        className="w-20 h-20 rounded-md overflow-hidden border bg-gray-100"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${index}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <SelectField
              label="Select a category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categories.map((c) => ({ label: c, value: c }))}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-md bg-primary text-white hover:bg-primaryDark transition"
              >
                {taskToEdit ? 'Update Task' : 'Post Task'}
              </button>
            </div>
          </div>
        </Box>
      </div>
    </Modal>
  )
}

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <input
      {...props}
      className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
    />
  </div>
)

const TextareaField = ({ label, ...props }) => (
  <div>
    <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <textarea
      {...props}
      rows="5"
      className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
    />
  </div>
)

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
    >
      <option value="" disabled>
        Select
      </option>
      {options.map((opt, i) => (
        <option key={i} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
)

const PlaceAutocomplete = ({ onPlaceSelect }) => {
  const placesLib = useMapsLibrary('places')
  const inputRef = useRef(null)
  const [autocomplete, setAutocomplete] = useState(null)

  useEffect(() => {
    if (!placesLib || !inputRef.current) return

    const options = {
      fields: ['geometry', 'name', 'formatted_address'],
      types: ['address'],
      componentRestrictions: { country: 'au' },
    }

    const ac = new placesLib.Autocomplete(inputRef.current, options)
    setAutocomplete(ac)
  }, [placesLib])

  useEffect(() => {
    if (!autocomplete) return

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      onPlaceSelect(place)
    })

    return () => listener?.remove()
  }, [autocomplete, onPlaceSelect])

  return (
    <div className="relative z-[1000]">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for an address"
        className="w-full p-4 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
        autoComplete="off"
      />
    </div>
  )
}
