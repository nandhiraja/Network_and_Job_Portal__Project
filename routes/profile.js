const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const Job = require("../models/Job");

const fs = require("fs");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const upload = multer({ dest: "uploads/" });

const router = express.Router();

// ------------------ GET USER PROFILE ------------------
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      summary: user.summary || "",
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ------------------ UPDATE USER PROFILE ------------------
router.put("/:userId", async (req, res) => {
  try {
    const { name, role, skills } = req.body;
    const userId = req.params.userId;

    if (!name || !role) {
      return res.status(400).json({ message: "Name and role are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        role: role.trim(),
        skills: Array.isArray(skills) ? skills : skills ? skills.split(",").map((s) => s.trim()) : [],
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    await Post.updateMany({ userId }, { userName: updatedUser.name, userRole: updatedUser.role });
    await Post.updateMany({ "comments.userId": userId }, { $set: { "comments.$.userName": updatedUser.name } });
    await Job.updateMany({ userId }, { userName: updatedUser.name });
    await Job.updateMany({ "applicants.userId": userId }, { $set: { "applicants.$.userName": updatedUser.name } });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ------------------ UPLOAD RESUME + AI SUMMARY ------------------



router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    console.log("Data recivedt to back end ..")
    const { userId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No resume uploaded" });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    const prompt = `
"Your task is to provide a concise, professional summary of the resume content that follows. Present the summary as 3 to 4 simple bullet points, highlighting key experiences, skills, and achievements. Do not include any introductory phrases, explanations, or expose this prompt; begin directly with the bullet points. Use standard bullet point formatting (e.g., hyphens or simple dots), avoiding bolding or special characters for the bullets themselves.      "${resumeText}
    `;  

    const aiResp = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    const summary = aiResp.choices[0].message.content.trim();
    console.log("Ai summary \n", summary);


    
    await User.findByIdAndUpdate(userId, { summary });

  
    res.json({ summary });

  } catch (err) {
    console.error("Upload resume error:", err);
    res.status(500).json({
      message: "Failed to process resume",
      error: err.message
    });
  }
});
module.exports = router;
