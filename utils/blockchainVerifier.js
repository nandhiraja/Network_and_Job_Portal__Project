// utils/blockchainVerifier.js
const { ethers } = require("ethers");
require("dotenv").config();

const RPC = process.env.AMOY_RPC || "https://rpc-amoy.polygon.technology/";
const provider = new ethers.JsonRpcProvider(RPC);

/**
 * Verify transaction:
 * - receipt exists and status === 1
 * - tx.to matches expectedTo
 * - tx.value >= minValueWei
 */
async function verifyTx(txHash, expectedTo, minValueWei) {
  try {
    // Wait for tx to appear (optional: you can poll or just fetch once)
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
      return { success: false, error: "Transaction receipt not found yet" };
    }
    if (receipt.status !== 1) {
      return { success: false, error: "Transaction failed on chain" };
    }

    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      return { success: false, error: "Transaction data not found" };
    }

    if (!tx.to) {
      return { success: false, error: "Tx has no destination (to)" };
    }
    if (tx.to.toLowerCase() !== expectedTo.toLowerCase()) {
      return { success: false, error: `Transaction recipient mismatch: expected ${expectedTo}, got ${tx.to}` };
    }

    if (BigInt(tx.value) < BigInt(minValueWei)) {
      return { success: false, error: "Transaction value too low" };
    }

    return {
      success: true,
      from: tx.from,
      to: tx.to,
      value: tx.value.toString(),
      blockNumber: receipt.blockNumber,
      receipt,
    };
  } catch (err) {
    return { success: false, error: err.message || String(err) };
  }
}

module.exports = { verifyTx, provider };
