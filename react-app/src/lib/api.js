// Mock API layer — mirrors static-site/js/api.js. Swap MOCK_MODE to
// false once the Express backend (Task 7+) is live at BASE_URL.
//
// NOTE: passwords are kept in plain text in localStorage here only
// because this is a client-only mock standing in for a real API.
// The real backend (Task 14) must hash passwords with bcrypt and
// must never return a password field to the client.

const BASE_URL = "http://localhost:5000/api";
export const MOCK_MODE = true;

const MOCK_USERS_KEY = "edutrack_mock_users";
const MOCK_COURSES = [
  { id: "c1", title: "Full Stack Fundamentals", duration: "12 weeks", status: "In progress" },
  { id: "c2", title: "Applied Data Analysis", duration: "8 weeks", status: "Enrolled" },
  { id: "c3", title: "Technical Interview Prep", duration: "6 weeks", status: "Completed" },
];

function readMockUsers() {
  try {
    return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeMockUsers(users) {
  try {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  } catch {
    /* storage unavailable — ignore */
  }
}

/** Strips the password before a user object ever leaves this module. */
function sanitize(user) {
  const { password, ...safe } = user;
  return safe;
}

/** Seeds one demo admin account on first load so the Admin tab is usable
 *  without a separate admin-provisioning flow. Real staff accounts would
 *  be created by the backend (Task 9), not self-registered. */
function ensureSeedAdmin() {
  const users = readMockUsers();
  if (!users.some((u) => u.role === "admin")) {
    users.push({
      id: "admin_seed",
      fullName: "Program Admin",
      email: "admin@edutrack.local",
      phone: "",
      password: "Admin123",
      role: "admin",
      createdAt: new Date().toISOString(),
    });
    writeMockUsers(users);
  }
}
ensureSeedAdmin();

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function registerUser(payload) {
  if (MOCK_MODE) {
    const users = readMockUsers();
    if (users.some((u) => u.email === payload.email)) {
      throw new Error("An account with this email already exists.");
    }
    const newUser = {
      id: `stu_${Date.now()}`,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      role: "student", // public registration only ever creates student accounts
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeMockUsers(users);
    return { user: sanitize(newUser), token: `mock-token-${newUser.id}` };
  }
  return request("/auth/register", { method: "POST", body: JSON.stringify(payload) });
}

export async function loginUser(payload) {
  if (MOCK_MODE) {
    const users = readMockUsers();
    const user = users.find(
      (u) => u.email === payload.identifier || u.fullName === payload.identifier
    );
    if (!user) throw new Error("No account found for that email or username.");

    if (user.password !== payload.password) {
      throw new Error("Incorrect password.");
    }

    const wantedRole = payload.role || "student";
    if (user.role !== wantedRole) {
      throw new Error(
        wantedRole === "admin"
          ? "This account isn't an admin account. Switch to the Student tab."
          : "This is an admin account. Switch to the Admin tab to log in."
      );
    }

    return { user: sanitize(user), token: `mock-token-${user.id}` };
  }
  return request("/auth/login", { method: "POST", body: JSON.stringify(payload) });
}

export async function fetchMyCourses() {
  if (MOCK_MODE) return MOCK_COURSES;
  return request("/students/me/courses");
}
