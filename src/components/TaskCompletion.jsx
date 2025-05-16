import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import Loader from './Loader'
import toast from 'react-hot-toast'

export default function TaskCompletionSection({ task, completeTask }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [recommend, setRecommend] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRatingChange = (newRating) => {
    setRating(newRating)
  }

  const handleSubmitReview = async () => {
    if (rating === 0 || !comment) {
      toast.error('Please provide a rating and a comment.')
      return
    }
    setLoading(true)
    try {
      await completeTask(task._id, { rating, comment, recommend })
      toast.success('Task completed and review submitted!')
    } catch (err) {
      console.error('Error completing task:', err)
      toast.error('Failed to complete task. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-[#1c1e21] p-6 rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Complete Task and Add a Review
      </h2>

      <div className="flex items-center gap-2 mb-4">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Rating
        </p>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={`cursor-pointer ${
                rating > index
                  ? 'text-yellow-500'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
              onClick={() => handleRatingChange(index + 1)}
              size={24}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="comment"
          className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Your Review
        </label>
        <textarea
          id="comment"
          rows="4"
          className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-white dark:bg-[#2a2d31] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          id="recommend"
          checked={recommend}
          onChange={() => setRecommend(!recommend)}
          className="h-5 w-5 text-green-600 border-gray-300 dark:border-gray-600 rounded"
        />
        <label htmlFor="recommend" className="text-gray-700 dark:text-gray-300">
          I recommend this provider
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <button
          onClick={handleSubmitReview}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Complete Task & Submit Review
        </button>
      )}
    </div>
  )
}
