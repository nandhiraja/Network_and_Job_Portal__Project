"use client"

import { useState, useEffect } from "react"
import JobCard from "./JobCard"
import JobPostForm from "../components/JobPostForm";
import { MdWork,MdOutlineUpdate } from "react-icons/md";
import { BsXLg } from "react-icons/bs";

import { BsCapslockFill } from "react-icons/bs";
const Jobs = ({ user }) => {
  const [activeJobTab, setActiveJobTab] = useState("all")
  const [jobs, setJobs] = useState([])
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showJobForm, setShowJobForm] = useState(false)
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    skills: "",
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs")
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
    }
    setLoading(false)
  }

  const fetchRecommendedJobs = async () => {
    try {
      const response = await fetch(`/api/jobs/recommended/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setRecommendedJobs(data)
      }
    } catch (error) {
      console.error("Error fetching recommended jobs:", error)
    }
  }

const handleJobPosted = async (jobData) => {
  try {
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        ...jobData,
        skills: jobData.skills.split(",").map((s) => s.trim()),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setJobs([data.job, ...jobs]);
      setShowJobForm(false);
      alert("Job posted successfully!");
    } else {
      alert("Failed to post job");
    }
  } catch (error) {
    console.error("Error creating job:", error);
    alert("Network error while posting job");
  }
};


  const handleApply = async (jobId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      })

      if (response.ok) {
        alert("Applied successfully!")
        fetchJobs() // Refresh jobs to show updated applicant count
      } else {
        const data = await response.json()
        alert(data.message)
      }
    } catch (error) {
      console.error("Error applying for job:", error)
      alert("Network error while applying")
    }
  }

  if (loading) {
    return <div className="loading">Loading jobs...</div>
  }

  return (
    <div className="jobs">
      <div className="jobs-header">
        <h2> <MdWork /> Job Opportunities</h2>
        <button className="add-job-button" onClick={() => setShowJobForm(!showJobForm)}>
          {showJobForm ? <BsXLg /> : "Create Job" }
        </button>
      </div>

      {showJobForm && (
        <div className="job-form">
          <h3>📝 Post a New Job</h3>
          {/* <form onSubmit={handleJobSubmit}>
            <div className="form-group">
              <label>Job Title:</label>
              <input
                type="text"
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                placeholder="e.g., Senior React Developer"
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                rows="4"
                placeholder="Describe the role, responsibilities, and requirements..."
                required
              />
            </div>
            <div className="form-group">
              <label>Required Skills (comma-separated):</label>
              <input
                type="text"
                value={jobForm.skills}
                onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                placeholder="e.g., JavaScript, React, Node.js, MongoDB"
                required
              />
            </div>
            <button type="submit">🚀 Post Job</button>

          </form> */}


         <div>
<JobPostForm user={user} onPosted={handleJobPosted} />
       </div>
        </div>
      )}

      <div className="job-tabs">
        <button
          className={`tab-button ${activeJobTab === "all" ? "active" : ""}`}
          onClick={() => setActiveJobTab("all")}
        >
          📋 All Jobs ({jobs.length})
        </button>
        <button
          className={`tab-button ${activeJobTab === "recommended" ? "active" : ""}`}
          onClick={() => {
            setActiveJobTab("recommended")
            fetchRecommendedJobs()
          }}
        >
          <BsCapslockFill /> Recommended ({recommendedJobs.length})
        </button>
      </div>

      {activeJobTab === "recommended" && (
        <div className="ai-recommendation">
          <button onClick={fetchRecommendedJobs} className="ai-button">
             Get AI Recommendations
          </button>
          <p className="ai-description">Based on your skills: {user.skills.join(", ")}</p>
        </div>
      )}

      <div className="jobs-list">
        {activeJobTab === "all" ? (
          jobs.length === 0 ? (
            <div className="no-jobs">
              <h3>No jobs posted yet</h3>
              <p>Be the first to post a job opportunity!</p>
            </div>
          ) : (
            jobs.map((job) => <JobCard key={job._id} job={job} onApply={handleApply} currentUser={user} />)
          )
        ) : recommendedJobs.length === 0 ? (
          <div className="no-jobs">
            <h3>No recommended jobs found</h3>
            <p>Try updating your skills in your profile to get better matches!</p>
          </div>
        ) : (
          recommendedJobs.map((job) => (
            <JobCard key={job._id} job={job} onApply={handleApply} currentUser={user} showMatchScore={true} />
          ))
        )}
      </div>
    </div>
  )
}

export default Jobs
