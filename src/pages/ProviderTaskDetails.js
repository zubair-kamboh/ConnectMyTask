import { XIcon, MapPinIcon, CalendarIcon, ClockIcon } from 'lucide-react'
import { motion } from 'framer-motion'

const ProviderTaskDetails = ({ task, onClose }) => {
  const [offerAmount, setOfferAmount] = useState('')
  const [offerMessage, setOfferMessage] = useState('')

  return (
    <motion.div
      key={task.id}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-0 bg-white shadow-lg z-10 overflow-y-auto p-6"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <XIcon size={24} />
      </button>

      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
            OPEN
          </span>
          <h1 className="text-3xl font-extrabold mt-2 text-[#001B5D]">
            {task.title}
          </h1>
        </div>

        <div className="text-gray-600 space-y-1">
          <div className="flex items-center">
            <MapPinIcon className="mr-2" size={20} />
            {task.location}
          </div>
          <div className="flex items-center">
            <CalendarIcon className="mr-2" size={20} />
            {task.date}
          </div>
          <div className="flex items-center">
            <ClockIcon className="mr-2" size={20} />
            {task.time}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#001B5D] mb-2">Details</h2>
          <p className="text-gray-700">
            {task.description || 'No description provided.'}
          </p>
        </div>

        <div className="bg-[#f5f7fa] p-6 rounded-xl shadow-sm text-center">
          <div className="text-sm font-medium text-gray-500 mb-1">
            TASK BUDGET
          </div>
          <div className="text-4xl font-extrabold text-[#001B5D]">
            {task.price}
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-2 text-[#001B5D]">Make an Offer</h3>
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Your offer amount"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073FF]"
            />
            <textarea
              placeholder="Message to task poster"
              value={offerMessage}
              onChange={(e) => setOfferMessage(e.target.value)}
              rows={3}
              className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073FF]"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(
                    `Offer submitted: $${offerAmount}\nMessage: ${offerMessage}`
                  )
                  setOfferAmount('')
                  setOfferMessage('')
                  onClose()
                }}
                className="px-6 py-2 bg-[#0073FF] text-white rounded-lg hover:bg-[#005ed9]"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskDetailPanel
