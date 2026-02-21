const API_BASE = import.meta.env.VITE_API_URL || 'https://plantgraduationproject.runasp.net/api'; 

function getToken() {
  return localStorage.getItem('access_token');
}

function getAuthHeaders() {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
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
      body: body ? JSON.stringify(body) : undefined,
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
  admin: {
    getMessages: () => api.get('/admin/messages'),
    patchMessage: (id, status) => api.patch(`/admin/messages/${id}`, { status }), 
    // deleteMessage: (id) => api.request('DELETE', `/admin/messages/${id}`),
    // deleteMessage: (id) => api.request('DELETE', `/admin/messages?id=${id}`),
    deleteMessage: (id) => api.request('DELETE', `/admin/messages/${id}`),
  },
};