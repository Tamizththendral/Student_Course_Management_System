// main.js — entry point loaded on every page. Detects which page is
// active (by looking for that page's form/section) and wires the
// relevant modules together. Keeps auth.js, validation.js, ui.js, and
// api.js independent and reusable.

import { register, login, requireAuth } from "./auth.js";
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  validateIdentifier,
  runValidators,
} from "./validation.js";
import { refreshNav, showFieldError, clearFieldErrors, showBanner, hideBanner, renderDashboard } from "./ui.js";
import { fetchMyCourses } from "./api.js";

// Every page needs the nav to reflect auth state.
refreshNav();

// ---------------- Register page ----------------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideBanner();
    clearFieldErrors(registerForm);

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const { isValid, errors } = runValidators({
      fullName: { value: fullName, validator: validateName },
      email: { value: email, validator: validateEmail },
      phone: { value: phone, validator: validatePhone },
      regPassword: { value: password, validator: validatePassword },
      confirmPassword: { value: confirmPassword, validator: validateConfirmPassword, extra: password },
    });

    if (!isValid) {
      Object.entries(errors).forEach(([field, message]) => showFieldError(field, message));
      showBanner("Please fix the highlighted fields before continuing.", "error");
      return; // form submission stopped — invalid data never reaches the API
    }

    try {
      await register({ fullName, email, phone, password });
      showBanner("Account created! Redirecting to your dashboard…", "success");
      setTimeout(() => (window.location.href = "dashboard.html"), 900);
    } catch (err) {
      showBanner(err.message, "error");
    }
  });
}

// ---------------- Login page ----------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideBanner();
    clearFieldErrors(loginForm);

    const identifier = document.getElementById("identifier").value;
    const password = document.getElementById("password").value;

    const { isValid, errors } = runValidators({
      identifier: { value: identifier, validator: validateIdentifier },
      password: { value: password, validator: validatePassword },
    });

    if (!isValid) {
      Object.entries(errors).forEach(([field, message]) => showFieldError(field, message));
      showBanner("Please fix the highlighted fields before continuing.", "error");
      return;
    }

    try {
      await login({ identifier, password });
      showBanner("Welcome back! Redirecting…", "success");
      setTimeout(() => (window.location.href = "dashboard.html"), 700);
    } catch (err) {
      showBanner(err.message, "error");
    }
  });
}

// ---------------- Dashboard page ----------------
const dashboardRoot = document.getElementById("courseTable");
if (dashboardRoot) {
  if (requireAuth()) {
    fetchMyCourses()
      .then((courses) => renderDashboard(courses))
      .catch((err) => console.error("Failed to load courses:", err));
  }
}
