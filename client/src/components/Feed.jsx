"use client"

import { useState, useEffect } from "react"
import PostForm from "./PostForm"
import CommentList from "./CommentList"
import { AiOutlineWechat } from "react-icons/ai";
import { FaThumbsUp } from "react-icons/fa";





const Feed = ({ user }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/feed")
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else {
        setError("Failed to fetch posts")
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      setError("Network error while fetching posts")
    }
    setLoading(false)
  }

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts])
  }


//==========================================================  to manage like  ============================================

const handleLike = async (postId) => {
    try {
      const response = await fetch(`/api/feed/${postId}/like`, {
        method: "POST",
      })


      if (response.ok) {
        const data = await response.json()
        setPosts(posts.map((post) => (post._id === postId ? { ...post, likes: data.likes } : post)))
      }
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }


//==========================================================  to manage CommaDS  ============================================


  const handleComment = async (postId, commentText) => {
    try {
      const response = await fetch(`/api/feed/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          text: commentText,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(posts.map((post) => (post._id === postId ? data.post : post)))
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  if (loading) {
    return <div className="loading">Loading posts...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }




   //    ==================================================== to UI part =============================================




  return (
    <div className="feed">
      <PostForm user={user} onNewPost={handleNewPost} />

      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="no-posts">
            <h3>No posts yet!</h3>
            <p>Be the first to share something with the community.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  <strong>{post.userName}</strong>
                  <span className="post-role">({post.userRole})</span>
                </div>
                <div className="post-date">{new Date(post.createdAt).toLocaleDateString()}</div>
              </div>

              <div className="post-content">{post.content}</div>

              <div className="post-actions">
                <button className="like-button" onClick={() => handleLike(post._id)}>
                  <FaThumbsUp/> {post.likes} {post.likes === 1 ? "Like" : "Likes"}
                </button>
                <span className="comments-count">
                  <AiOutlineWechat /> {post.comments.length} {post.comments.length === 1 ? "Comment" : "Comments"}
                </span>
              </div>

              <CommentList
                comments={post.comments}
                onAddComment={(text) => handleComment(post._id, text)}
                currentUser={user}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Feed
