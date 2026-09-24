import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const USERS_KEY = "edutrack_mock_users";

const INITIAL_COURSES = [
  { id: "c1", title: "Full Stack Fundamentals", duration: "12 weeks", status: "Open" },
  { id: "c2", title: "Applied Data Analysis", duration: "8 weeks", status: "Open" },
  { id: "c3", title: "Technical Interview Prep", duration: "6 weeks", status: "Open" },
  { id: "c4", title: "UI Foundations for Developers", duration: "5 weeks", status: "Open" },
];

function readMockUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeMockUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* storage unavailable — ignore */
  }
}

export default function AdminDashboard() {
  const { user } = useAuth();

  const [students, setStudents] = useState(readMockUsers);
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [newCourse, setNewCourse] = useState({ title: "", duration: "" });
  const [courseError, setCourseError] = useState("");

  useEffect(() => {
    function onStorage(e) {
      if (e.key === USERS_KEY) setStudents(readMockUsers());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const stats = useMemo(
    () => ({
      totalStudents: students.length,
      totalCourses: courses.length,
      openCourses: courses.filter((c) => c.status === "Open").length,
    }),
    [students, courses]
  );

  function handleRemoveStudent(id) {
    const next = students.filter((s) => s.id !== id);
    setStudents(next);
    writeMockUsers(next);
  }

  function handleToggleCourseStatus(id) {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === "Open" ? "Closed" : "Open" } : c))
    );
  }

  function handleRemoveCourse(id) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  function handleAddCourse(e) {
    e.preventDefault();
    setCourseError("");

    const title = newCourse.title.trim();
    const duration = newCourse.duration.trim();

    if (!title) return setCourseError("Course title is required.");
    if (!duration) return setCourseError("Course duration is required.");

    const course = { id: `c_${Date.now()}`, title, duration, status: "Open" };
    setCourses((prev) => [course, ...prev]);
    setNewCourse({ title: "", duration: "" });
  }

  return (
    <main>
      <section className="dash-header">
        <div className="container">
          <div>
            <p className="hero-eyebrow" style={{ marginBottom: 4 }}>
              Admin
            </p>
            <h1 style={{ marginBottom: 0 }}>
              {user ? `Registrar console — ${user.fullName.split(" ")[0]}` : "Registrar console"}
            </h1>
          </div>
          <span className="badge">Staff view</span>
        </div>
      </section>

      <div className="dash-grid">
        <aside className="profile-card">
          <h3 style={{ marginBottom: 16 }}>Overview</h3>
          <dl className="profile-list">
            <dt>Registered students</dt>
            <dd>{stats.totalStudents}</dd>
            <dt>Courses in catalog</dt>
            <dd>{stats.totalCourses}</dd>
            <dt>Open for enrollment</dt>
            <dd>{stats.openCourses}</dd>
          </dl>
        </aside>

        <div className="course-list" style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {/* ---------------- Students ---------------- */}
          <section>
            <h2>Students</h2>
            {students.length === 0 ? (
              <p>No students have registered yet.</p>
            ) : (
              <div className="table-scroll">
                <table className="course-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Joined</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id}>
                        <td>{s.fullName}</td>
                        <td>{s.email}</td>
                        <td>{s.phone || "—"}</td>
                        <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger"
                            style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                            onClick={() => handleRemoveStudent(s.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ---------------- Courses ---------------- */}
          <section>
            <h2>Course catalog</h2>

            <form
              onSubmit={handleAddCourse}
              style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 20 }}
            >
              <div className="field" style={{ marginBottom: 0, flex: "1 1 220px" }}>
                <label htmlFor="courseTitle">Course title</label>
                <input
                  id="courseTitle"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Intro to Databases"
                />
              </div>
              <div className="field" style={{ marginBottom: 0, flex: "0 1 160px" }}>
                <label htmlFor="courseDuration">Duration</label>
                <input
                  id="courseDuration"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse((f) => ({ ...f, duration: e.target.value }))}
                  placeholder="e.g. 6 weeks"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add course
              </button>
            </form>
            {courseError && <p style={{ color: "var(--error)", marginTop: -12 }}>{courseError}</p>}

            <div className="table-scroll">
              <table className="course-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id}>
                      <td>{c.title}</td>
                      <td>{c.duration}</td>
                      <td>
                        <span className="badge">{c.status}</span>
                      </td>
                      <td style={{ display: "flex", gap: 8 }}>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                          onClick={() => handleToggleCourseStatus(c.id)}
                        >
                          {c.status === "Open" ? "Close" : "Reopen"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                          onClick={() => handleRemoveCourse(c.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
