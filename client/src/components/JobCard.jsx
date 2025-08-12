"use client"
import { BsJournalText } from "react-icons/bs";
import { BsArrowClockwise  ,BsXLg } from "react-icons/bs";


const JobCard = ({ job, onApply, currentUser, showMatchScore = false }) => {
  const hasApplied = job.applicants.some((applicant) => applicant.userId === currentUser.id)
  const isOwnJob = job.userId === currentUser.id

  return (
    <div className="job-card">
      <div className="job-header">
        <h3 className="job-title">{job.title}</h3>
        {showMatchScore && (
          <div className="match-score">
            🎯 {job.matchScore} skill{job.matchScore !== 1 ? "s" : ""} match
          </div>
        )}
      </div>

      <div className="job-company">
        Posted by: <strong>{job.userName}</strong>
      </div>

      <div className="job-description">{job.description}</div>

      <div className="job-skills">
        <strong>Required Skills:</strong>
        <div className="skills-list">
          {job.skills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="job-footer">
        <div className="job-stats">
          <span>
            <BsJournalText /> {job.applicants.length} applicant{job.applicants.length !== 1 ? "s" : ""}
          </span>
          <span><BsArrowClockwise/> {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>

        {!isOwnJob && (
          <button
            className={`apply-button ${hasApplied ? "applied" : ""}`}
            onClick={() => onApply(job._id)}
            disabled={hasApplied}
          >
            {hasApplied ? "✅ Applied" : "📤 Apply"}
          </button>
        )}

        {isOwnJob && <span className="own-job">Your Job Post</span>}
      </div>
    </div>
  )
}

export default JobCard
