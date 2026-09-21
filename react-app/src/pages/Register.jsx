import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import FormField from "../components/FormField.jsx";
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
} from "../lib/validation.js";

const initialForm = { fullName: "", email: "", phone: "", password: "", confirmPassword: "" };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner(null);

    const nextErrors = {
      fullName: validateName(form.fullName),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.confirmPassword, form.password),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setBanner({ type: "error", message: "Please fix the highlighted fields before continuing." });
      return;
    }

    try {
      await register(form);
      setBanner({ type: "success", message: "Account created! Redirecting to your dashboard…" });
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      setBanner({ type: "error", message: err.message });
    }
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p className="sub">Takes about a minute. You can enroll in courses right after.</p>

        {banner && <div className={`form-banner show ${banner.type}`} role="alert">{banner.message}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormField id="fullName" label="Full name" value={form.fullName} onChange={handleChange} error={errors.fullName} autoComplete="name" />
          <FormField id="email" label="Email address" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
          <FormField id="phone" label="Phone number" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} autoComplete="tel" />
          <FormField
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            hint="At least 8 characters, with a number and a letter."
            autoComplete="new-password"
          />
          <FormField
            id="confirmPassword"
            label="Confirm password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
          <button type="submit" className="btn btn-primary btn-block">Create account</button>
        </form>

        <p className="auth-foot">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
