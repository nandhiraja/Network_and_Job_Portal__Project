"use client"

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <h1> Network & Job Portal</h1>
        </div>

        <div className="navbar-user">
          <span className="user-info">
            Welcome, <strong>{user.name}</strong> ({user.role})
          </span>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
