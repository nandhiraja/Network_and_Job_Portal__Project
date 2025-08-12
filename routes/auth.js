const express = require("express")
const User = require("../models/User")
const router = express.Router()






router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, skills } = req.body

 
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    
    const newUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, 
      role: role.trim(),
      skills: Array.isArray(skills) ? skills : skills ? skills.split(",").map((s) => s.trim()) : [],
    })

    await newUser.save()


    const response = {
      message: "User created successfully",
      userId: newUser._id,
     
    }

    res.status(201).json(response)
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// ========================== LOGIN ROUTE =========================



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

   
    const user = await User.findOne({ email: email.trim().toLowerCase() })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
