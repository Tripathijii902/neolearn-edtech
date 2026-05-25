import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : 'http://localhost:5000/api/v1/auth';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      set({
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
      });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed',
        loading: false 
      });
      return false;
    }
  },

  register: async (name, email, password, role = 'student', stream = null, classLevel = null) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/register`, { name, email, password, role: role.toLowerCase(), stream, classLevel });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      set({
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
      });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed',
        loading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
