"use client"

import { useState } from "react"
import Navbar from "./Navbar"
import Feed from "./Feed"
import Jobs from "./Jobs"
import Profile from "./Profile"
import { SiFeedly } from "react-icons/si";
import { FaCircleUser } from "react-icons/fa6";
import { MdWork } from "react-icons/md";


const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("feed")

  const renderActiveTab = () => {
    switch (activeTab) {
      case "feed":
        return <Feed user={user} />
      case "jobs":
        return <Jobs user={user} />
      case "profile":
        return <Profile user={user} />
      default:
        return <Feed user={user} />
    }
  }

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={onLogout} />

      <div className="dashboard-content">
        <div className="tab-navigation">
          <button  
            className={`tab-button ${activeTab === "feed" ? "active" : ""}`} 
            onClick={() => setActiveTab("feed")}>
            <SiFeedly /> 
            Feed
          </button>

          <button 
            className={`tab-button ${activeTab === "jobs" ? "active" : ""}`} 
            onClick={() => setActiveTab("jobs")}>
            <MdWork /> 
            Jobs
          </button>

          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}>
            <FaCircleUser/> 
           </button>

           
        </div>

        <div className="tab-content">{renderActiveTab()}</div>
      </div>
    </div>
  )
}

export default Dashboard
