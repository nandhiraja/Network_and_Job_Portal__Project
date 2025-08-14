const express = require("express")
const Job = require("../models/Job")
const User = require("../models/User")

const router = express.Router()

// Get all jobs (unchanged)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).populate("userId", "name")
    res.json(jobs)
  } catch (error) {
    console.error("Get jobs error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})



// ========================= JOBS ROUTES FOR CREATING =========================



// Create new job 
router.post("/", async (req, res) => {
  try {
    const { userId, title, description, skills } = req.body

    if (!userId || !title || !description || !skills) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Get user info
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Create job in MongoDB
    const newJob = new Job({
      userId,
      userName: user.name,
      title: title.trim(),
      description: description.trim(),
      skills: Array.isArray(skills) ? skills : skills.split(",").map((s) => s.trim()),
      applicants: [],
    })

    await newJob.save()

  
    const response = {
      message: "Job created successfully",
      job: newJob,
     
    }

    res.status(201).json(response)
  } catch (error) {
    console.error("Create job error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// ========================= JOBS ROUTES FOR RECOMMENDATIONS =========================





// Get recommended jobs for user (unchanged)
router.get("/recommended/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const userSkills = user.skills.map((skill) => skill.toLowerCase())
    const allJobs = await Job.find()

    // Simple keyword matching algorithm
    const recommendedJobs = allJobs
      .map((job) => {
        const jobSkills = job.skills.map((skill) => skill.toLowerCase())
        const matchCount = userSkills.filter((userSkill) =>
          jobSkills.some((jobSkill) => jobSkill.includes(userSkill) || userSkill.includes(jobSkill)),
        ).length

        return {
          ...job.toObject(),
          matchScore: matchCount,
        }
      })
      .filter((job) => job.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)

    res.json(recommendedJobs)
  } catch (error) {
    console.error("Get recommended jobs error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})



// ========================= JOBS ROUTES FOR APPLYING=========================


router.post("/:jobId/apply", async (req, res) => {
  try {
    const { userId } = req.body
    const jobId = req.params.jobId

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" })
    }

    // Get user info
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if user already applied
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    const alreadyApplied = job.applicants.some((applicant) => applicant.userId.toString() === userId)

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied for this job" })
    }

    
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        $push: {
          applicants: {
            userId,
            userName: user.name,
            appliedAt: new Date(),
          },
        },
      },
      { new: true },
    )

    res.json({
      message: "Applied successfully",
      job: updatedJob,
    })
  } catch (error) {
    console.error("Apply for job error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})




// ==================================================================================================


router.post("/pay-and-post", async (req, res) => {
  try {
    const { txHash, userId, title, description, skills } = req.body;

    if (!txHash || !userId || !title || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Save job to DB
    const newJob = await Job.create({
      userId,
      userName: user.name, 
      title: title.trim(),
      description: description.trim(),
      skills: skills.split(",").map(s => s.trim()),
      txHash,
      postedAt: new Date(),
    });

    res.json({ message: "Job posted successfully", job: newJob });

  } catch (err) {
    console.error("pay-and-post error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router
