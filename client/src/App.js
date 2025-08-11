"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Dashboard from "./components/Dashboard"
import "./App.css"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <div className="App">
        <Routes>

          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />

          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
