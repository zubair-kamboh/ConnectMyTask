import Avatar from './Avatar'
import { formatDistanceToNow } from 'date-fns'

const MessageCard = ({ message, onClick }) => (
  <div
    className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-transform hover:scale-[1.02] mb-4"
    onClick={onClick}
  >
    <Avatar name={message.name} profilePhoto={message.profilePhoto} />
    <div className="flex-1 ml-4">
      <div className="font-semibold text-[#1A3D8F] dark:text-white">
        {message.name}
      </div>
      <div className="text-sm text-[#999999] dark:text-gray-400">
        {message.lastMessage || 'No message available'}
      </div>
      <div className="text-xs text-[#666666] dark:text-gray-500">
        {formatDistanceToNow(new Date(message.lastTimestamp), {
          addSuffix: true,
        })}
      </div>
    </div>
  </div>
)

export default MessageCard
