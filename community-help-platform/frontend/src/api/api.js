// src/api/api.js
//
// Central API service — all backend calls go through here.
// Base URL points to the FastAPI backend running on port 8000.

const BASE_URL = 'http://localhost:8000'

// ─── Generic fetch helper ────────────────────────────────────────
// Wraps the browser's fetch() to:
//   1. Always send/receive JSON
//   2. Throw a readable error if the server returns an error status
async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    // Try to parse a FastAPI error message, fall back to status text
    let errorMsg = `Error ${response.status}`
    try {
      const errorData = await response.json()
      errorMsg = errorData.detail || errorMsg
    } catch (_) { /* ignore parse error */ }
    throw new Error(errorMsg)
  }

  return response.json()
}

// ─── AUTH ────────────────────────────────────────────────────────
export const authAPI = {
  register: (userData) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
}

// ─── USERS ───────────────────────────────────────────────────────
export const usersAPI = {
  getAll: () => request('/api/users/'),
  getById: (id) => request(`/api/users/${id}`),
}

// ─── REQUESTS ────────────────────────────────────────────────────
export const requestsAPI = {
  getAll: () => request('/api/requests/'),

  getMine: (userId) => request(`/api/requests/mine?user_id=${userId}`),

  create: (requestData) =>
    request('/api/requests/', {
      method: 'POST',
      body: JSON.stringify(requestData),
    }),

  updateStatus: (requestId, status, helperId = null) =>
    request(`/api/requests/${requestId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, helper_id: helperId }),
    }),
}
