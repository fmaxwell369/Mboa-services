import api from './axios';

// ---- AUTH ----
export const authApi = {
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

// ---- DOCUMENTS ----
export const documentsApi = {
  list: (params) => api.get('/documents', { params }).then((r) => r.data),
  mine: () => api.get('/documents/mine').then((r) => r.data),
  get: (id) => api.get(`/documents/${id}`).then((r) => r.data),
  create: (formData) =>
    api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  certify: (id, data) => api.patch(`/documents/${id}/certify`, data).then((r) => r.data),
  reject: (id, data) => api.patch(`/documents/${id}/reject`, data).then((r) => r.data),
  verify: (code) => api.get(`/documents/verify/${code}`).then((r) => r.data),
};

// ---- USERS (admin) ----
export const usersApi = {
  list: () => api.get('/users').then((r) => r.data),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }).then((r) => r.data),
  remove: (id) => api.delete(`/users/${id}`).then((r) => r.data),
};