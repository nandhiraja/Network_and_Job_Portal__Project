const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },

    blockchainTxHash: { type: String, default: null },
    paidAt: { type: Date, default: null },

    
    applicants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        userName: String,
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Job", jobSchema)
