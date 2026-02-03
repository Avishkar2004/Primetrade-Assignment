const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.error?.message || data?.message || 'Request failed';
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  auth: {
    signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  },
  me: {
    get: () => request('/me'),
    update: (body) => request('/me', { method: 'PUT', body: JSON.stringify(body) }),
  },
  tasks: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/tasks${q ? `?${q}` : ''}`);
    },
    get: (id) => request(`/tasks/${id}`),
    create: (body) => request('/tasks', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  },
};
