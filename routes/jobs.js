const express = require("express")
const Job = require("../models/Job")
const User = require("../models/User")
// const { verifyTx } = require("../utils/blockchainVerifier");
// const simpleBlockchain = require("./utils/simpleBlockchain")
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

// Apply for job (unchanged)
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

    // Add applicant
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

// const ADMIN_WALLET = process.env.ADMIN_WALLET || "0x19ed09c2eCa8bf28b5ad762ED574864B48E39ca6";
// const POLYGONSCAN_API = "VSKXVEKWU1IUDHPTAEU82DMUH168EXKCRM"; //process.env.POLYGONSCAN_API_KEY; // create free at polygonscan.com
// const AMOY_EXPLORER = "https://api-amoy.polygonscan.com/api";

// // POST /api/jobs/pay-and-post
// router.post("/pay-and-post", async (req, res) => {
//   try {
//     const { txHash, userId, title, description, skills } = req.body;
//     if (!txHash || !userId || !title || !description) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // 1️⃣ Verify transaction on Polygon Amoy using PolygonScan API
//     const verifyUrl = `${AMOY_EXPLORER}?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${POLYGONSCAN_API}`;
//     const txStatusResp = await fetch(verifyUrl);
//     const txStatusData = await txStatusResp.json();

//     if (!txStatusData || txStatusData.status !== "1" || txStatusData.result.status !== "1") {
//       return res.status(400).json({ message: "Transaction not successful" });
//     }

//     // 2️⃣ Check full transaction details
//     const txDetailUrl = `${AMOY_EXPLORER}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${POLYGONSCAN_API}`;
//     const txDetailResp = await fetch(txDetailUrl);
//     const txDetailData = await txDetailResp.json();

//     if (!txDetailData || !txDetailData.result) {
//       return res.status(400).json({ message: "Unable to fetch transaction details" });
//     }

//     const toAddress = txDetailData.result.to?.toLowerCase();
//     const fromAddress = txDetailData.result.from?.toLowerCase();
//     const valueWei = parseInt(txDetailData.result.value, 16);

//     // 3️⃣ Verify receiver & amount
//     if (toAddress !== ADMIN_WALLET.toLowerCase()) {
//       return res.status(400).json({ message: "Invalid payment recipient" });
//     }

//     const minAmountWei = Math.floor(0.001 * 1e18); // 0.001 MATIC in Wei
//     if (valueWei < minAmountWei) {
//       return res.status(400).json({ message: "Payment amount too low" });
//     }

//     // 4️⃣ Save job in DB
//     const newJob = await Job.create({
//       userId,
//       title,
//       description,
//       skills: skills.split(",").map(s => s.trim()),
//       txHash,
//       postedAt: new Date(),
//     });

//     res.json({ message: "Job posted successfully", job: newJob });

//   } catch (err) {
//     console.error("pay-and-post error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });



// POST /api/jobs/pay-and-post (skip PolygonScan verification)
router.post("/pay-and-post", async (req, res) => {
  try {
    const { txHash, userId, title, description, skills } = req.body;

    if (!txHash || !userId || !title || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Save job to DB
    const newJob = await Job.create({
      userId,
      userName: user.name, // ✅ required field
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
