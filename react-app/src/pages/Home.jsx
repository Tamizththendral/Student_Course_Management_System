import React from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard.jsx";

const courses = [
  {
    tag: "Web Development",
    title: "Full Stack Fundamentals",
    description: "HTML, CSS, JavaScript, React, Node and MongoDB — one project, start to deploy.",
    meta: "12 weeks · Beginner–Intermediate",
  },
  {
    tag: "Data",
    title: "Applied Data Analysis",
    description: "Spreadsheets to SQL to dashboards — reading data critically before visualizing it.",
    meta: "8 weeks · Beginner",
  },
  {
    tag: "Careers",
    title: "Technical Interview Prep",
    description: "Structured practice on data structures, system design basics, and mock interviews.",
    meta: "6 weeks · All levels",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <div>
            <p className="hero-eyebrow">The student registrar, simplified</p>
            <h1>One record for every student, every course, every update.</h1>
            <p className="lead">
              EduTrack replaces the spreadsheet-and-chat-group shuffle with a single portal where
              students register, enroll, and track their courses — and staff keep one accurate ledger.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">Create an account</Link>
              <Link to="/login" className="btn btn-ghost">I already have one</Link>
            </div>
          </div>
          <div className="ledger-card">
            <div className="ledger-card__head">Term Snapshot</div>
            <dl style={{ margin: 0 }}>
              <div className="ledger-row"><dt>Active students</dt><dd>128</dd></div>
              <div className="ledger-row"><dt>Open courses</dt><dd>9</dd></div>
              <div className="ledger-row"><dt>Enrollments this week</dt><dd>34</dd></div>
              <div className="ledger-row"><dt>Avg. response time</dt><dd>Instant</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-head">
          <h2>Built for how students actually check in</h2>
          <p>Three things a portal needs to get right — we start there.</p>
        </div>
        <div className="feature-grid">
          <article className="feature">
            <span className="num">i.</span>
            <h3>Register once</h3>
            <p>A short form, real validation, and a confirmation — no lost sign-ups in a group chat.</p>
          </article>
          <article className="feature">
            <span className="num">ii.</span>
            <h3>See your standing</h3>
            <p>The dashboard shows exactly which courses you're enrolled in and their status, at a glance.</p>
          </article>
          <article className="feature">
            <span className="num">iii.</span>
            <h3>Hear about changes as they happen</h3>
            <p>Notifications and messages arrive in real time — no refreshing to find out what changed.</p>
          </article>
        </div>
      </section>

      <section className="section" id="courses">
        <div className="section-head">
          <h2>This term's courses</h2>
          <p>A preview of the catalog — full enrollment happens from your dashboard.</p>
        </div>
        <div className="card-grid">
          {courses.map((c) => (
            <CourseCard key={c.title} {...c} />
          ))}
        </div>
      </section>
    </main>
  );
}
