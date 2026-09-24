import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout(e) {
    e.preventDefault();
    logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <header className="site-header">
      <nav className="nav" aria-label="Primary">
        <Link to="/" className="brand">
          <span className="brand-mark">E</span> EduTrack
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>

        <ul className={`nav-links${open ? " open" : ""}`}>
          <li>
            <NavLink to="/" end onClick={() => setOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/courses" onClick={() => setOpen(false)}>
              Courses
            </NavLink>
          </li>

          {!isLoggedIn && (
            <>
              <li>
                <NavLink to="/login" onClick={() => setOpen(false)}>
                  Log in
                </NavLink>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
          {isLoggedIn && (
  <>
    <li>
      <NavLink
        to={user?.role === "admin" ? "/admin" : "/dashboard"}
        onClick={() => setOpen(false)}
      >
        {user?.role === "admin" ? "Admin console" : "Dashboard"}
      </NavLink>
    </li>

    <li>
      <a href="#logout" className="btn btn-outline" onClick={handleLogout}>
        Log out
      </a>
    </li>
  </>
)}
        </ul>
      </nav>
    </header>
  );
}
