// ChatModal.jsx
import { Dialog } from '@headlessui/react'
import { FaTimes } from 'react-icons/fa'
import ChatUI from './ChatUI'

export default function ChatModal({ isOpen, onClose, provider }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Chat with {provider?.name}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>
          <ChatUI />
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
