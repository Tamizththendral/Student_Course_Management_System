import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <Link to="/" className="brand" style={{ color: "#F4F2EC", fontSize: "1.05rem" }}>
          EduTrack
        </Link>
        <ul className="footer-links">
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/login">Log in</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
        <span className="footer-fine">© 2026 EduTrack. Student project — FSWD Capstone.</span>
      </div>
    </footer>
  );
}
