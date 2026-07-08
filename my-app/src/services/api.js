const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const TOKEN_KEY = "analytico_token";
const USERNAME_KEY = "analytico_username";
const GUEST_KEY = "analytico_is_guest";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY);
}

export function setAuth(token, username, isGuest = false) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
  if (isGuest) {
    localStorage.setItem(GUEST_KEY, "1");
  } else {
    localStorage.removeItem(GUEST_KEY);
  }
}

export function isGuest() {
  return localStorage.getItem(GUEST_KEY) === "1";
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(GUEST_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}

export function register(email, password) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function login(email, password) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function guestLogin() {
  return apiRequest("/api/auth/guest", { method: "POST" });
}

export function verifyEmail(token) {
  return apiRequest(`/api/auth/verify/${token}`);
}

export function resendVerification(email) {
  return apiRequest("/api/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function getAnalytics(platform) {
  return apiRequest(`/api/analytics?platform=${encodeURIComponent(platform)}`);
}

export function getRecommendations(platform, question) {
  return apiRequest("/api/recommendations", {
    method: "POST",
    body: JSON.stringify({ platform, question }),
  });
}

export function getMetaOAuthUrl() {
  return apiRequest("/api/auth/meta/start");
}

export function getProfile() {
  return apiRequest("/api/profile/");
}

export function updateProfile(companyName, objective) {
  return apiRequest("/api/profile/", {
    method: "PUT",
    body: JSON.stringify({ company_name: companyName, objective }),
  });
}

export function getScheduledPosts(start, end) {
  const params = new URLSearchParams();
  if (start) params.set("start", start);
  if (end) params.set("end", end);
  return apiRequest(`/api/calendar/posts?${params.toString()}`);
}

export function createScheduledPost({ date, time, content, platform = "facebook", source = "manual" }) {
  return apiRequest("/api/calendar/posts", {
    method: "POST",
    body: JSON.stringify({ date, time, content, platform, source }),
  });
}

export function updateScheduledPost(id, { date, time, content }) {
  return apiRequest(`/api/calendar/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify({ date, time, content }),
  });
}

export function deleteScheduledPost(id) {
  return apiRequest(`/api/calendar/posts/${id}`, { method: "DELETE" });
}

export function generateSchedule({ scope, startDate, platform = "facebook" }) {
  return apiRequest("/api/calendar/generate", {
    method: "POST",
    body: JSON.stringify({ scope, start_date: startDate, platform }),
  });
}
