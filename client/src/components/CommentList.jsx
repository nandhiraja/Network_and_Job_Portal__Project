"use client"

import { useState } from "react"
import { BiSolidSend } from "react-icons/bi";
const CommentList = ({ comments, onAddComment, currentUser }) => {
  
  const [newComment, setNewComment] = useState("")
  const [showComments, setShowComments] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    await onAddComment(newComment.trim())
    setNewComment("")
    setLoading(false)
  }

  return (
    <div className="comments-section">
      {comments.length > 0 && (
        <button className="toggle-comments" onClick={() => setShowComments(!showComments)}>
          {showComments ? "Hide" : "Show"} Comments ({comments.length})
        </button>
      )}

      {showComments && (
        <div className="comments-list">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <div className="comment-header">
                <strong className="comment-author">{comment.userName}</strong>
                <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="comment-text">{comment.text}</div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          required
          maxLength="200"
        />
        <button type="submit" disabled={loading || !newComment.trim()}>
          {loading ? "..." : <BiSolidSend />}
        </button>
      </form>
    </div>
  )
}

export default CommentList
