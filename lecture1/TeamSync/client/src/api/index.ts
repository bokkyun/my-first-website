import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Groups
export const groupApi = {
  getAll: () => api.get('/groups'),
  create: (data: { name: string; description?: string; color: string }) =>
    api.post('/groups', data),
  getOne: (id: string) => api.get(`/groups/${id}`),
  join: (inviteCode: string) => api.post('/groups/join', { inviteCode }),
  leave: (id: string) => api.delete(`/groups/${id}/leave`),
  getMembers: (id: string) => api.get(`/groups/${id}/members`),
};

// Schedules
export const scheduleApi = {
  getAll: () => api.get('/schedules'),
  create: (data: {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    isAllDay: boolean;
    groupIds: string[];
  }) => api.post('/schedules', data),
  update: (
    id: string,
    data: {
      title: string;
      description?: string;
      startDate: string;
      endDate: string;
      isAllDay: boolean;
      groupIds: string[];
    }
  ) => api.put(`/schedules/${id}`, data),
  delete: (id: string) => api.delete(`/schedules/${id}`),
};
