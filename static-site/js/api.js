// api.js — thin HTTP wrapper. Right now the backend doesn't exist yet
// (that's Task 7+), so each function first tries a real endpoint and
// falls back to a local mock so the frontend can be built and tested
// independently. Swap MOCK_MODE to false once the Express API is live.

const BASE_URL = "http://localhost:5000/api";
export const MOCK_MODE = true;

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

// ---- Mock persistence (localStorage) used only while MOCK_MODE = true ----
const MOCK_USERS_KEY = "edutrack_mock_users";
const MOCK_COURSES = [
  { id: "c1", title: "Full Stack Fundamentals", duration: "12 weeks", status: "In progress" },
  { id: "c2", title: "Applied Data Analysis", duration: "8 weeks", status: "Enrolled" },
  { id: "c3", title: "Technical Interview Prep", duration: "6 weeks", status: "Completed" },
];

function readMockUsers() {
  return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "[]");
}
function writeMockUsers(users) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
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
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeMockUsers(users);
    return { user: newUser, token: `mock-token-${newUser.id}` };
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
    return { user, token: `mock-token-${user.id}` };
  }
  return request("/auth/login", { method: "POST", body: JSON.stringify(payload) });
}

export async function fetchMyCourses() {
  if (MOCK_MODE) return MOCK_COURSES;
  return request("/students/me/courses");
}
