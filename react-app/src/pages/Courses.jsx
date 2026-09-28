import React from "react";
import CourseCard from "../components/CourseCard.jsx";
import { useCourses } from "../context/CourseContext.jsx";

export default function Courses() {
  const { courses, loading, error } = useCourses();

  return (
    <main className="section">
      <div className="section-head">
        <h1>Course catalog</h1>
        <p>
          Everything open for enrollment this term. Enroll from your dashboard
          once you're logged in.
        </p>
      </div>

      {loading && <p>Loading courses...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="card-grid">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              image={course.image}
              alt={course.courseName}
              title={course.courseName}
              description={course.overview}
              courseKey={course.id}
              tag={course.category}
              meta={`${course.duration} · ${course.level}`}
            />
          ))}
        </div>
      )}
    </main>
  );
}
