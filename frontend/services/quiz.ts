import axios, { InternalAxiosRequestConfig } from 'axios';
import { getToken } from '@/services/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Quiz service methods
const quizService = {
  // Get all quizzes
  getAllQuizzes: async () => {
    try {
      console.log("Auth token:", getToken()); // Log token for debugging
      const response = await api.get('/api/quizzes');
      return response.data;
    } catch (error: any) {
      console.error("Quiz service error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get a single quiz by ID
  getQuizById: async (id: string) => {
    try {
      const response = await api.get(`/api/quizzes/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Quiz service error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Submit quiz answers
  submitQuiz: async (id: string, answers: Record<string, string>) => {
    try {
      const response = await api.post(`/api/quizzes/${id}/submit`, { answers });
      return response.data;
    } catch (error: any) {
      console.error("Quiz service error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get all quiz results for current user
  getQuizResults: async () => {
    try {
      const response = await api.get('/api/quizzes/results');
      return response.data;
    } catch (error: any) {
      console.error("Quiz service error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get a specific quiz result for current user
  getQuizResultById: async (id: string) => {
    try {
      const response = await api.get(`/api/quizzes/${id}/results`);
      return response.data;
    } catch (error: any) {
      console.error("Quiz service error:", error.response?.data || error.message);
      throw error;
    }
  }
};

export default quizService;