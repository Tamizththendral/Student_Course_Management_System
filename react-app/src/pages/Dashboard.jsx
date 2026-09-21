import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchMyCourses } from "../lib/api.js";

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchMyCourses()
      .then((data) => !cancelled && setCourses(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!user) return null; // ProtectedRoute redirects before this renders

  return (
    <main>
      <section className="dash-header">
        <div className="container">
          <div>
            <p className="hero-eyebrow" style={{ marginBottom: 4 }}>Dashboard</p>
            <h1 style={{ marginBottom: 0 }}>Welcome back, {user.fullName.split(" ")[0]}</h1>
          </div>
          <span className="badge">Signed in</span>
        </div>
      </section>

      <div className="dash-grid">
        <aside className="profile-card">
          <div className="avatar">{user.fullName.trim().charAt(0).toUpperCase()}</div>
          <h3>{user.fullName}</h3>
          <dl className="profile-list">
            <dt>Email</dt>
            <dd>{user.email}</dd>
            <dt>Phone</dt>
            <dd>{user.phone || "—"}</dd>
            <dt>Student ID</dt>
            <dd>{user.id}</dd>
            <dt>Member since</dt>
            <dd>{new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long" })}</dd>
          </dl>
        </aside>

        <section className="course-list">
          <h2>Your courses</h2>
          {loading && <p>Loading your courses…</p>}
          {error && <p style={{ color: "var(--error)" }}>{error}</p>}
          {!loading && !error && (
            <div className="table-scroll">
              <table className="course-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Duration</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id}>
                      <td>{c.title}</td>
                      <td>{c.duration}</td>
                      <td><span className="badge">{c.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
