import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/courses` : 'http://localhost:5000/api/v1/courses';
const INSTRUCTOR_API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/instructor/courses` : 'http://localhost:5000/api/v1/instructor/courses';
const ENROLL_API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/enroll` : 'http://localhost:5000/api/v1/enroll';

const useCourseStore = create((set) => ({
  courses: [],
  loading: false,
  error: null,

  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(API_URL);
      set({ courses: res.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch courses', loading: false });
    }
  },

  createCourse: async (courseData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const res = await axios.post(INSTRUCTOR_API_URL, courseData, config);
      set((state) => ({ 
        courses: [...state.courses, res.data.data], 
        loading: false 
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create course', loading: false });
      return false;
    }
  },

  enrolledCourses: [],
  
  fetchEnrolledCourses: async () => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) return;
      const res = await axios.get(`${ENROLL_API_URL}/my-courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ enrolledCourses: res.data.data });
    } catch (error) {
      console.error("Failed to fetch enrolled courses", error);
    }
  },

  enrollInCourse: async (courseId) => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) return false;
      const res = await axios.post(`${ENROLL_API_URL}/${courseId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ enrolledCourses: res.data.data });
      return true;
    } catch (error) {
      console.error("Failed to enroll in course", error);
      return false;
    }
  }
}));

export default useCourseStore;
