import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const Avatar = ({ name, src }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
    )
  }
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
  return (
    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
      {initials}
    </div>
  )
}

const Comments = ({ taskId, comments, refreshTask }) => {
  const [textValue, setTextValue] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')

  const token = localStorage.getItem('providerToken')
  const loggedInProviderId = JSON.parse(localStorage.getItem('provider')).id
  const handlePostComment = async () => {
    if (!textValue.trim()) {
      toast.error('Please enter a comment.')
      return
    }

    try {
      await axios.post(
        `https://api.connectmytask.xyz/api/tasks/${taskId}/comment`,
        { text: textValue },
        { headers: { Authorization: token } }
      )
      toast.success('Comment posted!')
      setTextValue('')
      refreshTask()
    } catch (err) {
      console.error('Error posting comment:', err)
      toast.error('Failed to post your comment.')
    }
  }

  const handlePostReply = async (commentId) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply.')
      return
    }

    try {
      await axios.post(
        `https://api.connectmytask.xyz/api/tasks/${taskId}/comment/${commentId}/reply`,
        { text: replyText },
        { headers: { Authorization: token } }
      )
      toast.success('Reply posted!')
      setReplyingTo(null)
      setReplyText('')
      refreshTask()
    } catch (err) {
      console.error('Error posting reply:', err)
      toast.error('Failed to post your reply.')
    }
  }

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString() // e.g., "12/05/2025, 10:30:45 AM"
  }

  const renderReplies = (replies = []) => {
    return replies.map((reply) => (
      <div
        key={reply._id}
        className="ml-12 mt-3 border-l pl-4 border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-start gap-3">
          <Avatar
            name={reply.user?.name}
            src={reply.user?.profilePhoto || reply.user?.avatar}
          />
          <div>
            <div className="mb-1">
              <span className="font-semibold text-[#001B5D] dark:text-blue-200">
                {reply.user?.name}
              </span>
              {loggedInProviderId === reply.user?._id && (
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  (You)
                </span>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {formatDateTime(reply.date)}
              </p>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{reply.text}</p>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="mt-8 mb-8 bg-white dark:bg-gray-900 p-4 rounded-md">
      <h2 className="text-xl font-bold mb-4">Comments</h2>

      {comments?.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
      ) : (
        <div className={`${comments.length > 3 ? ' pr-2' : ''}`}>
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800"
            >
              <div className="flex items-start gap-3">
                <Avatar
                  name={comment.user?.name || 'User'}
                  src={comment.user?.profilePhoto || comment.user?.avatar}
                />
                <div className="w-full">
                  <div className="mb-1">
                    <span className="font-semibold text-[#001B5D] dark:text-blue-200">
                      {comment.user?.name}
                    </span>
                    {loggedInProviderId === comment.user?._id && (
                      <span className="text-sm text-gray-500 ml-1">(You)</span>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDateTime(comment.date)}
                    </p>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {comment.text}
                  </p>

                  <button
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === comment._id ? null : comment._id
                      )
                    }
                    className="text-sm text-[#1A3D8F] hover:underline"
                  >
                    {replyingTo === comment._id ? 'Cancel' : 'Reply'}
                  </button>

                  {replyingTo === comment._id && (
                    <div className="mt-2">
                      <textarea
                        className="w-full border rounded-md p-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-gray-300 dark:border-gray-700"
                        rows="3"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />

                      <button
                        onClick={() => handlePostReply(comment._id)}
                        className="mt-1 bg-[#1A3D8F] hover:bg-[#163373] text-white px-3 py-1 rounded text-sm"
                      >
                        Post Reply
                      </button>
                    </div>
                  )}

                  {comment.replies &&
                    comment.replies.length > 0 &&
                    renderReplies(comment.replies)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-6">
        <textarea
          className="w-full border rounded-md p-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-gray-300 dark:border-gray-700"
          rows="3"
          placeholder="Write a comment..."
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />
        <button
          onClick={handlePostComment}
          className="mt-2 bg-[#1A3D8F] hover:bg-[#163373] text-white px-4 py-2 rounded transition-colors duration-150"
        >
          Post Comment
        </button>
      </div>
    </div>
  )
}

export default Comments
