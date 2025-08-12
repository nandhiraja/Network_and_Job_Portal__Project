// src/components/JobPostForm.jsx
import React, { useState } from "react";

const AMOUNT_DEFAULT = parseFloat(process.env.NEXT_PUBLIC_PLATFORM_FEE || "0.001"); 

export default function JobPostForm({ user, onPosted }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);


   // -----------------------------------------------POLYGON TEST NET CONNECTION ------------------------------------------------------------
 
  async function ensurePolygonAmoy() {
    if (!window.ethereum) throw new Error("MetaMask not found");

    const AMOY_CHAIN_ID = "0x13882"; 
    const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

    if (currentChainId !== AMOY_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: AMOY_CHAIN_ID }],
        });
      } catch (switchError) {
      
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: AMOY_CHAIN_ID,
              chainName: "Polygon Amoy Testnet",
              nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
              rpcUrls: ["https://rpc-amoy.polygon.technology/"],
              blockExplorerUrls: ["https://amoy.polygonscan.com/"],
            }],
          });
        } else {
          throw switchError;
        }
      }
    }
  }

 
  async function connectWallet() {
    if (!window.ethereum) throw new Error("MetaMask not found");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return accounts[0];
  }

  function toHexWei(amountMatic) {
    const wei = Math.floor(amountMatic * 1e18);
    return "0x" + wei.toString(16);
  }

  async function handlePayAndPost(e) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return alert("Title and description required");
    setLoading(true);
    try {
      await ensurePolygonAmoy();     

      const account = await connectWallet();
      const admin = process.env.NEXT_PUBLIC_ADMIN_WALLET || "0x19ed09c2eCa8bf28b5ad762ED574864B48E39ca6";
      const amount = AMOUNT_DEFAULT;

      // Send transaction to admin wallet
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: admin,
            value: toHexWei(amount),
          },
        ],
      });

   
      const resp = await fetch("/api/jobs/pay-and-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txHash,
          userId: user.id,
          title,
          description,
          skills,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || JSON.stringify(data));

      alert("Job posted! tx: " + txHash);

     if (onPosted) {
             onPosted({
               title,
               description,
               skills
             });
           }
      setTitle("");
      setDescription("");
      setSkills("");   
      
   } catch (err) {
      console.error("payAndPost error:", err);
      alert("Error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }













  
  return (
    <div className="job-post-form">
      <h3>Post a Job (pay {AMOUNT_DEFAULT} MATIC)</h3>
      <form onSubmit={handlePayAndPost}>
        <div className="form-group">
          <label>Job Title:</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Job title" required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Job description" required />
        </div>
        <div className="form-group">
          <label>Required Skills (comma-separated):</label>
          <input 
            value={skills} 
            onChange={(e) => setSkills(e.target.value)} 
            placeholder="Comma-separated skills" />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : `Pay & Post (${AMOUNT_DEFAULT} MATIC)`}
        </button>
      </form>
    </div>
  );
}
