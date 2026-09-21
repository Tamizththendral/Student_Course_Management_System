import React from "react";

export default function CourseCard({ tag, title, description, meta }) {
  return (
    <article className="course-card">
      <div className="course-card__body">
        <span className="course-card__tag">{tag}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="course-card__meta">{meta}</div>
      </div>
    </article>
  );
}
