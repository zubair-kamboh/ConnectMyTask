import React, { useState, useRef, useEffect } from 'react'
import { Modal } from '@mui/material'
import Loader from './Loader'
import axios from 'axios'
import { toast } from 'react-toastify'
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

export default function PostTaskModal({ open, onClose }) {
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
      await axios.post('http://localhost:3300/api/tasks', taskData, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Task posted successfully!')
      setFormData({
        title: '',
        description: '',
        budget: '',
        deadline: '',
        location: '',
        images: [],
        category: '',
      })
      onClose()
    } catch (err) {
      toast.error('Failed to post task. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  {
    loading && (
      <div className="fixed top-0 left-0 w-full h-full z-[1000] bg-black bg-opacity-50 flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex justify-center items-center h-screen bg-opacity-80 overflow-auto">
        <div className="relative z-[999] w-full max-w-4xl p-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-semibold text-gray-800 dark:text-white">
              Post a Task
            </h3>
            <button
              onClick={onClose}
              className="text-3xl text-gray-800 dark:text-white hover:text-red-500"
            >
              &times;
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                What do you need done?
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Help move my sofa"
                className="w-full p-4 border rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                Describe your task in detail
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="e.g. I need help moving furniture"
                className="w-full p-4 border rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                Your budget (in $)
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full p-4 border rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                When is the deadline?
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full p-4 border rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                Location Type
              </label>
              <select
                name="locationType"
                value={formData.locationType}
                onChange={(e) =>
                  setFormData({ ...formData, locationType: e.target.value })
                }
                className="w-full p-4 border rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="remote">Remote</option>
                <option value="physical">Physical</option>
              </select>
            </div>

            {formData.locationType === 'physical' && (
              <div>
                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Address
                </label>
                <PlaceAutocomplete
                  onPlaceSelect={(place) => {
                    const address = place?.formatted_address || ''
                    const lat = place?.geometry?.location?.lat()
                    const lng = place?.geometry?.location?.lng()

                    setFormData((prev) => ({
                      ...prev,
                      locationDetails: {
                        address,
                        lat,
                        lng,
                      },
                    }))
                  }}
                />
              </div>
            )}
            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                Upload images (Max 3)
              </label>
              <div className="flex flex-col ">
                <label
                  htmlFor="file-upload"
                  className="w-full max-w-xs p-4 text-center bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition duration-200"
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
                    maxLength={3}
                    className="hidden"
                  />
                </label>

                {formData.images.length > 0 && (
                  <div className="mt-4 flex space-x-2">
                    {formData.images.map((file, index) => (
                      <div
                        key={index}
                        className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${index}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                Select a category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-4 border rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={onClose}
                className="px-6 py-3 border rounded-md dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-md"
              >
                Post Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

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
        className="w-full p-4 border rounded-md dark:bg-gray-700 dark:text-white"
        autoComplete="off"
      />
    </div>
  )
}
