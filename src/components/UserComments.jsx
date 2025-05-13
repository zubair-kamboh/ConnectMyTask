import React, { useState } from 'react'
import { toast } from 'react-toastify'
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

  return (
    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
      {initials.slice(0, 2)}
    </div>
  )
}

const Comments = ({ taskId, comments, refreshTask }) => {
  const [textValue, setTextValue] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')

  const token = localStorage.getItem('token')
  const loggedInProviderId = JSON.parse(localStorage.getItem('user')).id

  const handlePostComment = async () => {
    if (!textValue.trim()) {
      toast.error('Please enter a comment.')
      return
    }

    try {
      await axios.post(
        `http://localhost:3300/api/tasks/${taskId}/comment`,
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
        `http://localhost:3300/api/tasks/${taskId}/comment/${commentId}/reply`,
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
      <div key={reply._id} className="ml-12 mt-3 border-l pl-4 border-gray-200">
        <div className="flex items-start gap-3">
          <Avatar
            name={reply.user?.name}
            src={reply.user?.profilePhoto || reply.user?.avatar}
          />
          <div>
            <div className="mb-1">
              <span className="font-semibold text-[#001B5D]">
                {reply.user?.name}
              </span>
              {loggedInProviderId === reply.user?._id && (
                <span className="text-sm text-gray-500 ml-1">(You)</span>
              )}
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDateTime(reply.date)}
              </p>
            </div>

            <p className="text-gray-700">{reply.text}</p>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="mt-8 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Comments</h2>

      <div className="mb-6">
        <textarea
          className="w-full border rounded-md p-3 text-sm"
          rows="3"
          placeholder="Write a comment..."
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />
        <button
          onClick={handlePostComment}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Post Comment
        </button>
      </div>

      {comments?.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <div className={`${comments.length > 3 ? ' pr-2' : ''}`}>
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
            >
              <div className="flex items-start gap-3">
                <Avatar
                  name={comment.user?.name || 'User'}
                  src={comment.user?.profilePhoto || comment.user?.avatar}
                />
                <div className="w-full">
                  <div className="mb-1">
                    <span className="font-semibold text-[#001B5D]">
                      {comment.user?.name}
                    </span>
                    {loggedInProviderId === comment.user?._id && (
                      <span className="text-sm text-gray-500 ml-1">(You)</span>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDateTime(comment.date)}
                    </p>
                  </div>

                  <p className="text-gray-700 mb-2">{comment.text}</p>

                  <button
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === comment._id ? null : comment._id
                      )
                    }
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {replyingTo === comment._id ? 'Cancel' : 'Reply'}
                  </button>

                  {replyingTo === comment._id && (
                    <div className="mt-2">
                      <textarea
                        className="w-full border rounded-md p-2 text-sm"
                        rows="2"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <button
                        onClick={() => handlePostReply(comment._id)}
                        className="mt-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
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
    </div>
  )
}

export default Comments
