"use client"

import { useState } from "react"
import { BsSend } from "react-icons/bs";
import { BsPenFill } from "react-icons/bs";
const PostForm = ({ user, onNewPost }) => {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

 // ========================================= new post Management  ===============================================
   
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)

    try {
      const response = await fetch("/api/feed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          content: content.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        onNewPost(data.post)
        setContent("")
      } else {
        alert("Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      alert("Network error while creating post")
    }

    setLoading(false)
  }






  return (
    <div className="post-form">

      <h3><BsPenFill /> Share an update</h3>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Share your thoughts, achievements, or ask for advice..."
          rows="4"
          required
          maxLength="500"
        />


        <div className="form-footer">
          <span className="char-count">{content.length}/500</span>
          <button type="submit" disabled={loading || !content.trim()}>
            {loading ? "Posting..." : <BsSend />}

            
          </button>
        </div>

      </form>
    </div>
  )
}

export default PostForm
