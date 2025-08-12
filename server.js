const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();


const authRoutes = require("./routes/auth");
const feedRoutes = require("./routes/feed");
const jobsRoutes = require("./routes/jobs");
const profileRoutes = require("./routes/profile");

const app = express();
const PORT = process.env.PORT || 5000;



app.use(cors({
  origin: ['http://localhost:3000', 'https://network-and-job-portal.onrender.com', 'https://network-job-portal.netlify.app/'],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/profile", profileRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
