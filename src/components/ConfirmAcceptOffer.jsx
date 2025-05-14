import { motion, AnimatePresence } from 'framer-motion'

export default function AcceptOfferModal({ isOpen, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with backdrop blur and dimming */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Prevent clicks on modal from closing it */}
            <motion.div
              className="relative z-60 w-11/12 max-w-md bg-white rounded-xl p-6 shadow-xl"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // Prevent overlay click closing modal
            >
              <h2 className="text-xl font-semibold text-[#1A3D8F] mb-4">
                Confirm Accept Offer
              </h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to accept this offer? This action cannot
                be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 rounded-md bg-[#1A3D8F] hover:bg-[#14538A] text-white"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
