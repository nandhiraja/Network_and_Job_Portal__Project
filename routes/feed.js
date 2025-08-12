const express = require("express")
const Post = require("../models/Post")
const User = require("../models/User")
const router = express.Router()

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("userId", "name role")

    res.json(posts)
  } catch (error) {
    console.error("Get posts error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})


// ========================= POST ROUTES FOR CREATING =========================

// Create new post
router.post("/", async (req, res) => {
  try {
    const { userId, content } = req.body

    if (!userId || !content) {
      return res.status(400).json({ message: "User ID and content are required" })
    }

    // Get user info
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const newPost = new Post({
      userId,
      userName: user.name,
      userRole: user.role,
      content: content.trim(),
      likes: 0,
      comments: [],
    })

    await newPost.save()

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    })
  } catch (error) {
    console.error("Create post error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})


// ========================== POST ROUTES FOR LIKING AND COMMENTING =========================

// Like a post
router.post("/:postId/like", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.postId, { $inc: { likes: 1 } }, { new: true })

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    res.json({
      message: "Post liked successfully",
      likes: post.likes,
    })
  } catch (error) {
    console.error("Like post error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add comment to post
router.post("/:postId/comment", async (req, res) => {
  try {
    const { userId, text } = req.body

    if (!userId || !text) {
      return res.status(400).json({ message: "User ID and comment text are required" })
    }

    // Get user info
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $push: {
          comments: {
            userId,
            userName: user.name,
            text: text.trim(),
          },
        },
      },
      { new: true },
    )

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    res.json({
      message: "Comment added successfully",
      post,
    })
  } catch (error) {
    console.error("Add comment error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})






module.exports = router
