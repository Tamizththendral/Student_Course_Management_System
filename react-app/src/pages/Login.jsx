import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import FormField from "../components/FormField.jsx";
import { validateIdentifier, validatePassword } from "../lib/validation.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null); // { type, message }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner(null);

    const nextErrors = {
      identifier: validateIdentifier(form.identifier),
      password: validatePassword(form.password),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setBanner({ type: "error", message: "Please fix the highlighted fields before continuing." });
      return;
    }

    try {
     await login({ ...form, role });
      setBanner({ type: "success", message: "Welcome back! Redirecting…" });
      setTimeout(() => {
        navigate(role === "admin" ? "/admin" : "/dashboard");
}, 500);
    } catch (err) {
      setBanner({ type: "error", message: err.message });
    }
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="sub">Log in to see your enrolled courses and updates.</p>

        {banner && <div className={`form-banner show ${banner.type}`} role="alert">{banner.message}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="role-switch">
            <button
              type="button"
              className={role === "student" ? "active" : ""}
              onClick={() => setRole("student")}
            >
              Student
            </button>
          <button
            type="button"
            className={role === "admin" ? "active" : ""}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>
          <FormField
            id="identifier"
            label="Email or username"
            value={form.identifier}
            onChange={handleChange}
            error={errors.identifier}
            autoComplete="username"
          />
          <FormField
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
          />
          <button type="submit" className="btn btn-primary btn-block">Log in</button>
        </form>

        <p className="auth-foot">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </main>
  );
}
