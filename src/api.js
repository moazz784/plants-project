// src/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'https://plantgraduationproject.runasp.net/api';

function getAuthHeaders() {
  return { 'Content-Type': 'application/json' };
}

export function getErrorMessage(err, fallback = 'Something went wrong') {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  return err.message || err.code || fallback;
}

export const api = {
  async request(method, path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: getAuthHeaders(),
      credentials: 'include',
      body: body !== undefined && body !== null ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, ...data };
    return data;
  },

  get: (path) => api.request('GET', path),
  post: (path, body) => api.request('POST', path, body),
  put: (path, body) => api.request('PUT', path, body),
  patch: (path, body) => api.request('PATCH', path, body),

  auth: {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (name, email, password) => api.post('/auth/register', { name, email, password }),
    logout: () => api.post('/auth/logout'),
    me: () => api.get('/auth/me'),
  },

  users: {
    updateMe: (body) => api.put('/users/me', {
      name: body.name,
      newPassword: body.newPassword,
      profileImageBase64: body.profileImageBase64,
    }),
  },

  messages: {
    create: (body) => api.post('/messages', body),
  },

  chat: {
    send: (sessionId, messages, language) =>
      api.post('/chat', { sessionId, messages, language }),
  },

  services: {
    getSoilTypes: (lang) => api.get(`/services/soil-types${lang ? `?lang=${lang}` : ''}`),
    getClimates: (lang) => api.get(`/services/climates${lang ? `?lang=${lang}` : ''}`),
    getCrops: (lang) => api.get(`/services/crops${lang ? `?lang=${lang}` : ''}`),
    getRecommendations: (soilType, climate, lang) =>
      api.get(`/services/recommendations?soilType=${encodeURIComponent(soilType)}&climate=${encodeURIComponent(climate)}${lang ? `&lang=${lang}` : ''}`),
    calculate: (soilType, climate, crop, landArea, lang) =>
      api.get(`/services/calculate?soilType=${encodeURIComponent(soilType)}&climate=${encodeURIComponent(climate)}&crop=${encodeURIComponent(crop)}&landArea=${encodeURIComponent(landArea)}${lang ? `&lang=${lang}` : ''}`),
  },

  admin: {
    getMessages: () => api.get('/admin/messages'),
    patchMessage: (id, status) => api.patch(`/admin/messages/${id}`, { status }),
    deleteMessage: (id) => api.request('DELETE', `/admin/messages/${id}`),
  },
};
