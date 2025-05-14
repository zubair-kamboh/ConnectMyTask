import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarIcon, ClockIcon, XIcon } from 'lucide-react'

const SubmitOffer = ({
  isVisible,
  onClose,
  task,
  offerAmount,
  setOfferAmount,
  handleSubmitOffer,
  estimatedTime,
  setEstimatedTime,
  comment,
  setComment,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-2xl p-8 relative shadow-xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <XIcon size={24} />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold text-[#001B5D] mb-6">
              {task.title}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="text-lg font-semibold text-[#001B5D]">
                {task.title}
              </div>
              <p className="text-gray-700">{task.description}</p>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2" size={18} />
                  {format(new Date(task.deadline), 'PPP')}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="mr-2" size={18} />
                  {format(new Date(task.deadline), 'p')}
                </div>
                <div className="text-lg font-bold text-[#1A3D8F] ml-auto">
                  Budget: ${task.budget}
                </div>
              </div>
            </div>

            {/* Offer inputs */}
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Enter your offer amount"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:primary"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
              />
              <input
                type="text"
                placeholder="Write an estimated time & details about your offer..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:primary"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
              />

              <textarea
                placeholder="Write a comment about your offer..."
                className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:primary"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                onClick={() => handleSubmitOffer(task._id)}
                className="w-full bg-[#1A3D8F] hover:bg-[#163373] text-white text-lg font-semibold rounded-full py-3 transition"
              >
                Submit Offer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SubmitOffer
