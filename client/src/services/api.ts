import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach student token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusride_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for handling 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected route, redirect to login unless already there
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('campusride_token');
        localStorage.removeItem('campusride_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Typed API Helper functions
export const authService = {
  login: async (studentId: string, password: string) => {
    const res = await api.post('/auth/login', { studentId, password });
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const dashboardService = {
  getDashboard: async () => {
    const res = await api.get('/dashboard');
    return res.data;
  },
};

export const busService = {
  getAll: async () => {
    const res = await api.get('/buses');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get(`/buses/${id}`);
    return res.data;
  },
  getSeats: async (id: string) => {
    const res = await api.get(`/buses/${id}/seats`);
    return res.data;
  },
  getLiveGPS: async () => {
    const res = await api.get('/buses/gps/live');
    return res.data;
  },
};

export const bookingService = {
  getMyBookings: async () => {
    const res = await api.get('/bookings');
    return res.data;
  },
  createBooking: async (data: {
    busId?: string;
    seatNumber: string;
    boardingPoint?: string;
    destination?: string;
  }) => {
    const res = await api.post('/bookings', data);
    return res.data;
  },
  cancelBooking: async (bookingId: string) => {
    const res = await api.delete(`/bookings/${bookingId}`);
    return res.data;
  },
};
