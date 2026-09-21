import React from "react";
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
  {
    tag: "Design",
    title: "UI Foundations for Developers",
    description: "Typography, color, and layout systems that make a developer's UI look intentional.",
    meta: "5 weeks · Beginner",
  },
];

export default function Courses() {
  return (
    <main className="section">
      <div className="section-head">
        <h1>Course catalog</h1>
        <p>Everything open for enrollment this term. Enroll from your dashboard once you're logged in.</p>
      </div>
      <div className="card-grid">
        {courses.map((c) => (
          <CourseCard key={c.title} {...c} />
        ))}
      </div>
    </main>
  );
}
