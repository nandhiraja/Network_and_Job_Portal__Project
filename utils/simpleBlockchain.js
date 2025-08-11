const { ethers } = require("ethers")

class SimpleBlockchain {
  constructor() {
    this.provider = null
    this.contract = null
    this.signer = null
    this.isConnected = false
  }

  // Connect to blockchain
  async connect() {
    try {
      console.log("🔗 Connecting to blockchain...")

      // Connect to local Hardhat network
      this.provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")

      // Use test account
      this.signer = new ethers.Wallet(
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Default Hardhat account
        this.provider,
      )

      // Contract info
      const contractAddress = process.env.CONTRACT_ADDRESS
      const contractABI = [
        "function registerUser(string memory _name, string memory _email) public",
        "function createJob(string memory _title, string memory _description) public",
        "function getUser(address _userAddress) public view returns (tuple(string name, string email, uint256 timestamp))",
        "function getJob(uint256 _jobId) public view returns (tuple(uint256 jobId, string title, string description, address creator, uint256 timestamp))",
        "function getStats() public view returns (uint256, uint256)",
        "event UserRegistered(address indexed userAddress, string name)",
        "event JobCreated(uint256 indexed jobId, string title, address indexed creator)",
      ]

      this.contract = new ethers.Contract(contractAddress, contractABI, this.signer)

      // Test connection
      await this.contract.getStats()

      this.isConnected = true
      console.log("✅ Blockchain connected!")
      return true
    } catch (error) {
      console.log("❌ Blockchain connection failed:", error.message)
      return false
    }
  }

  // Register user on blockchain
  async registerUser(name, email) {
    try {
      if (!this.isConnected) {
        console.log("⚠️ Blockchain not connected, skipping...")
        return { success: false, error: "Not connected" }
      }

      console.log("📝 Registering user on blockchain...")

      const tx = await this.contract.registerUser(name, email)
      const receipt = await tx.wait()

      console.log("✅ User registered on blockchain!")
      console.log("📄 Transaction:", receipt.hash)

      return {
        success: true,
        transactionHash: receipt.hash,
      }
    } catch (error) {
      console.log("❌ Blockchain user registration failed:", error.message)
      return { success: false, error: error.message }
    }
  }

  // Create job on blockchain
  async createJob(title, description) {
    try {
      if (!this.isConnected) {
        console.log("⚠️ Blockchain not connected, skipping...")
        return { success: false, error: "Not connected" }
      }

      console.log("💼 Creating job on blockchain...")

      const tx = await this.contract.createJob(title, description)
      const receipt = await tx.wait()

      console.log("✅ Job created on blockchain!")
      console.log("📄 Transaction:", receipt.hash)

      return {
        success: true,
        transactionHash: receipt.hash,
      }
    } catch (error) {
      console.log("❌ Blockchain job creation failed:", error.message)
      return { success: false, error: error.message }
    }
  }

  // Get blockchain stats
  async getStats() {
    try {
      if (!this.isConnected) return { users: 0, jobs: 0 }

      const [userCount, jobCount] = await this.contract.getStats()
      return {
        users: userCount.toString(),
        jobs: jobCount.toString(),
      }
    } catch (error) {
      console.log("❌ Failed to get stats:", error.message)
      return { users: 0, jobs: 0 }
    }
  }
}

// Export single instance
module.exports = new SimpleBlockchain()
