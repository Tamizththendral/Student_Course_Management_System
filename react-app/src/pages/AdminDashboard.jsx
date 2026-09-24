import React from "react";

const AdminDashboard = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage students, courses, enrollments, and learning progress.</p>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3>Total Students</h3>
          <p className="stat-number">120</p>
        </div>

        <div className="card">
          <h3>Total Courses</h3>
          <p className="stat-number">12</p>
        </div>

        <div className="card">
          <h3>Active Enrollments</h3>
          <p className="stat-number">86</p>
        </div>

        <div className="card">
          <h3>Completion Reports</h3>
          <p className="stat-number">64%</p>
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <h2>Course Management</h2>
          <p>Add, edit, and delete courses.</p>
          <button className="btn btn-primary">Manage Courses</button>
        </div>

        <div className="card">
          <h2>Student Management</h2>
          <p>View and manage registered students.</p>
          <button className="btn btn-primary">Manage Students</button>
        </div>

        <div className="card">
          <h2>Enrollments</h2>
          <p>Monitor student course enrollments.</p>
          <button className="btn btn-primary">View Enrollments</button>
        </div>

        <div className="card">
          <h2>Progress Reports</h2>
          <p>View student learning progress and completion.</p>
          <button className="btn btn-primary">View Reports</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
