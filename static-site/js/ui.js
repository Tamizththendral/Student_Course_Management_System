// ui.js — all direct DOM manipulation lives here, so auth.js and
// validation.js stay framework/DOM-agnostic and easy to reuse.

import { isLoggedIn, getSession, logout } from "./auth.js";

/** Show/hide nav items based on login state, and wire the logout link. */
export function refreshNav() {
  const loggedIn = isLoggedIn();
  document.querySelectorAll(".auth-only-in").forEach((el) => (el.hidden = !loggedIn));
  document.querySelectorAll(".auth-only-out").forEach((el) => (el.hidden = loggedIn));

  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
      window.location.href = "index.html";
    });
  }

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }
}

/** Displays a single field-level error message under an input. */
export function showFieldError(fieldName, message) {
  const input = document.getElementById(fieldName);
  const errorEl = document.getElementById(`${fieldName}Error`);
  if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
  if (errorEl) {
    errorEl.textContent = message || "";
    errorEl.classList.toggle("show", Boolean(message));
  }
}

/** Clears all field errors within a form element. */
export function clearFieldErrors(formEl) {
  formEl.querySelectorAll(".field-error.show").forEach((el) => el.classList.remove("show"));
  formEl.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.setAttribute("aria-invalid", "false"));
}

/** Shows a success/error banner above a form. */
export function showBanner(message, type = "error") {
  const banner = document.getElementById("formBanner");
  if (!banner) return;
  banner.textContent = message;
  banner.className = `form-banner show ${type}`;
}

export function hideBanner() {
  const banner = document.getElementById("formBanner");
  if (!banner) return;
  banner.className = "form-banner";
}

/** Renders the dashboard profile card and course table from session + course data. */
export function renderDashboard(courses) {
  const session = getSession();
  if (!session) return;
  const { user } = session;

  const welcome = document.getElementById("welcomeHeading");
  if (welcome) welcome.textContent = `Welcome back, ${user.fullName.split(" ")[0]}`;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  setText("profileName", user.fullName);
  setText("profileEmail", user.email);
  setText("profilePhone", user.phone || "—");
  setText("profileId", user.id);
  setText("profileSince", new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long" }));

  const avatarEl = document.getElementById("avatarInitial");
  if (avatarEl) avatarEl.textContent = user.fullName.trim().charAt(0).toUpperCase();

  const tbody = document.getElementById("courseTableBody");
  if (tbody) {
    tbody.innerHTML = courses
      .map(
        (c) => `
        <tr>
          <td>${c.title}</td>
          <td>${c.duration}</td>
          <td><span class="badge">${c.status}</span></td>
        </tr>`
      )
      .join("");
  }
}
