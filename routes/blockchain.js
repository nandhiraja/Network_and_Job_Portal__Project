const express = require("express")
const multiChainService = require("../utils/multiChainService")
const User = require("../models/User")
const Job = require("../models/Job")
const router = express.Router()

// Get network info with POL currency
router.get("/network-info", (req, res) => {
  const networkInfo = multiChainService.getNetworkInfo()
  res.json({
    network: networkInfo,
    contractAddress: process.env.CONTRACT_ADDRESS,
    chainId: process.env.CHAIN_ID,
    isInitialized: multiChainService.isInitialized,
    setupInstructions: {
      message: "Add network to MetaMask using ChainList",
      chainlistUrl: multiChainService.getChainlistUrl(),
      faucetUrl: multiChainService.getFaucetUrl(),
      currency: networkInfo.currency,
    },
  })
})

// Initialize blockchain service
router.get("/init", async (req, res) => {
  try {
    const success = await multiChainService.initialize()
    if (success) {
      const networkInfo = multiChainService.getNetworkInfo()
      res.json({
        message: "Blockchain service initialized successfully",
        network: networkInfo,
        faucet: multiChainService.getFaucetUrl(),
        explorer: multiChainService.getExplorerUrl(),
        chainlist: multiChainService.getChainlistUrl(),
        currency: networkInfo.currency,
        instructions: {
          step1: `Add ${networkInfo.name} to MetaMask using ChainList`,
          step2: `Get free ${networkInfo.currency} from faucet`,
          step3: "Deploy your smart contract",
          step4: "Start using the blockchain features",
        },
      })
    } else {
      res.status(500).json({ message: "Failed to initialize blockchain service" })
    }
  } catch (error) {
    res.status(500).json({ message: "Blockchain initialization error", error: error.message })
  }
})

// Get user balance with POL currency
router.get("/balance/:address", async (req, res) => {
  try {
    const { address } = req.params
    const balanceInfo = await multiChainService.getBalance(address)
    const networkInfo = multiChainService.getNetworkInfo()

    res.json({
      address,
      ...balanceInfo,
      faucet: multiChainService.getFaucetUrl(),
      network: networkInfo.name,
      message:
        balanceInfo.balance === "0"
          ? `Get free ${networkInfo.currency} from the faucet!`
          : "Balance loaded successfully",
    })
  } catch (error) {
    res.status(500).json({ message: "Failed to get balance", error: error.message })
  }
})

// Register user on blockchain
router.post("/register-user", async (req, res) => {
  try {
    const { userId } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const result = await multiChainService.registerUser(user.name, user.email, user.role, user.skills)

    if (result.success) {
      // Update user with blockchain info
      user.blockchainTxHash = result.transactionHash
      await user.save()

      res.json({
        message: "User registered on blockchain successfully",
        ...result,
      })
    } else {
      res.status(500).json({
        message: "Blockchain registration failed",
        error: result.error,
      })
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
