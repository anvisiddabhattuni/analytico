const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const TOKEN_KEY = "analytico_token";
const USERNAME_KEY = "analytico_username";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY);
}

export function setAuth(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
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

export function getInstagramOAuthUrl() {
  return apiRequest("/api/auth/instagram/start");
}
