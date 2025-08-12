const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

// Import routes
const authRoutes = require("./routes/auth")
const feedRoutes = require("./routes/feed")
const jobsRoutes = require("./routes/jobs")
const profileRoutes = require("./routes/profile")


const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const MONGODB_URI =process.env.MONGODB_URI ; // "mongodb://localhost:27017/job-portal"    // process.env.MONGODB_URI ||

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(" MongoDB connection error:", err))



// Routes
app.use("/api/auth", authRoutes)
app.use("/api/feed", feedRoutes)
app.use("/api/jobs", jobsRoutes)
app.use("/api/profile", profileRoutes)

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "MERN Job Portal Backend with Simple Blockchain is running!" })
})

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"))
  })
}

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`)
  console.log(` Environment: ${process.env.NODE_ENV || "development"}`)
})
