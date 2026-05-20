const TOKEN_KEY = 'si-auth-token';
const USER_KEY = 'si-auth-user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken() && getStoredUser());
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function checkOnline() {
  try {
    const data = await request('/api/health');
    return data?.online === true;
  } catch {
    return false;
  }
}

export async function register(username, email, password) {
  const data = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
  saveSession(data.token, data.user);
  return data.user;
}

export async function login(email, password) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  saveSession(data.token, data.user);
  return data.user;
}

export function logout() {
  clearSession();
}

export async function submitScore(score, level) {
  if (!isLoggedIn()) return null;
  return request('/api/scores', {
    method: 'POST',
    body: JSON.stringify({ score, level }),
  });
}

export async function fetchLeaderboard(limit = 20) {
  const data = await request(`/api/leaderboard?limit=${limit}`);
  return data.leaderboard;
}

export async function fetchMyRank() {
  if (!isLoggedIn()) return null;
  try {
    return await request('/api/leaderboard/me');
  } catch {
    return null;
  }
}
