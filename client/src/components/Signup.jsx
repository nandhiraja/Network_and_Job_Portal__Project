"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Signup = () => {


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    skills: "",
  })

  
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill)

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          skills: skillsArray,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Account created successfully! Please login.")
        navigate("/login")
      } else {
        setError(data.message || "Signup failed")
      }
    } catch (error) {
      console.error("Signup error:", error)
      setError("Network error. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign Up for Job Portal</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role/Position:</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., Software Developer, Designer"
              required
              autoComplete="organization-title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills (comma-separated):</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., JavaScript, React, Node.js"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
