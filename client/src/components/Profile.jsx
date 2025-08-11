"use client";

import { useState, useEffect, useCallback } from "react";
import { BsPencilSquare, BsX } from "react-icons/bs";

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    skills: [],
    summary: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);

  // Fetch profile data on mount and when user.id changes
  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch(`/api/profile/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        console.error("Failed to fetch profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, [user.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle profile update form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          role: profileData.role,
          skills: profileData.skills,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData((prev) => ({ ...prev, ...data.user }));
        setIsEditing(false);
        alert("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify({ ...user, ...data.user }));
      } else {
        const errorData = await response.json();
        alert("Failed to update profile: " + (errorData.message || response.statusText));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Network error while updating profile");
    } finally {
      setLoading(false);
    }
  };

  // Upload resume file and generate summary via backend AI
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeLoading(true);

    const formData = new FormData();
    
    formData.append("resume", file);
    formData.append("userId", user.id);
for (let [key, val] of formData.entries()) {
  console.log(key, val);
}    try {
      const resp = await fetch("/api/profile/upload-resume", {
        method: "POST",
        body: formData, // Browser sets Content-Type automatically
      });

      try {
        const data = await resp.json();
        if (resp.ok) {
          setProfileData((prev) => ({ ...prev, summary: data.summary }));
          alert("Summary generated from resume!");
        } else {
          alert("Failed: " + (data.message || "Unknown error"));
        }
      } catch (jsonErr) {
        const text = await resp.text();
        alert("Unexpected server response: " + text);
        console.error("Failed parsing JSON:", jsonErr, "Response text:", text);
      }
    } catch (err) {
      console.error("Resume upload error:", err);
      alert("Error uploading resume from frontend");
    } finally {
      setResumeLoading(false);
    }
  };

  // Handle skills input as comma-separated string → array
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    setProfileData((prev) => ({ ...prev, skills: skillsArray }));
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h2>👤 My Profile</h2>
        <button
          className="edit-button"
          onClick={() => setIsEditing((prev) => !prev)}
          aria-label={isEditing ? "Cancel editing" : "Edit profile"}
        >
          {isEditing ? <BsX /> : <BsPencilSquare />}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              id="name"
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={profileData.email}
              disabled
              className="disabled-input"
            />
            <small>Email cannot be changed</small>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role/Position:</label>
            <input
              id="role"
              type="text"
              value={profileData.role}
              onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="resume-upload">Upload Resume (PDF/DOCX/TXT):</label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleResumeUpload}
            />
            {resumeLoading && <p>Processing resume...</p>}
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills (comma-separated):</label>
            <input
              id="skills"
              type="text"
              value={profileData.skills.join(", ")}
              onChange={handleSkillsChange}
              placeholder="e.g., JavaScript, React, Node.js"
            />
            <small>💡 These skills are used for job recommendations</small>
          </div>

          <button type="submit" disabled={loading} className="save-button">
            {loading ? "Saving..." : "Update"}
          </button>
        </form>
      ) : (
        <div className="profile-display">
          <div className="profile-field">
            <label>Full Name:</label>
            <span>{profileData.name}</span>
          </div>

          <div className="profile-field">
            <label>Email:</label>
            <span>{profileData.email}</span>
          </div>

          <div className="profile-field">
            <label>Role/Position:</label>
            <span>{profileData.role}</span>
          </div>

          <div className="profile-field">
            <label>Skills:</label>
            <div className="skills-display">
              {profileData.skills.length > 0 ? (
                profileData.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="no-skills">No skills added yet</span>
              )}
            </div>
          </div>

          {profileData.summary && (
            <div className="profile-field">
              <label>About Me:</label>
              <p className="summary-text">{profileData.summary}</p>
            </div>
          )}

          <div className="profile-stats">
            <p>Account created on: {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
