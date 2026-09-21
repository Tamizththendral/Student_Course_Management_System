// auth.js — centralizes application auth state (logged-in user + token)
// and the actions that change it. This is the single source of truth
// that ui.js reads from to decide what the nav/dashboard should show.

import { registerUser, loginUser } from "./api.js";

const SESSION_KEY = "edutrack_session";

export function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function isLoggedIn() {
  return Boolean(getSession());
}

export async function register({ fullName, email, phone, password }) {
  const { user, token } = await registerUser({ fullName, email, phone, password });
  setSession({ user, token });
  return user;
}

export async function login({ identifier, password }) {
  const { user, token } = await loginUser({ identifier, password });
  setSession({ user, token });
  return user;
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

/** Redirects to login.html if there is no active session. Call on protected pages. */
export function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}
