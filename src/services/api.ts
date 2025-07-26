import axios from 'axios';

// API Base URL - Update this to match your Node.js + Express backend
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api' 
  : 'http://localhost:3001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiClient.post('/auth/login', credentials),
    register: (userData: { name: string; email: string; password: string; role: string }) =>
      apiClient.post('/auth/register', userData),
    logout: () => apiClient.post('/auth/logout'),
    verifyToken: () => apiClient.get('/auth/verify'),
  },

  // Reports
  reports: {
    getAll: (filters?: any) => apiClient.get('/reports', { params: filters }),
    getById: (id: string) => apiClient.get(`/reports/${id}`),
    create: (reportData: any) => apiClient.post('/reports', reportData),
    update: (id: string, updates: any) => apiClient.put(`/reports/${id}`, updates),
    delete: (id: string) => apiClient.delete(`/reports/${id}`),
    getStats: () => apiClient.get('/reports/stats'),
  },

  // AI Analysis (Python Flask API)
  ai: {
    analyzeImage: (imageUrl: string) =>
      apiClient.post('/ai/analyze-pothole', { imageUrl }),
    estimateMaterials: (analysisData: any) =>
      apiClient.post('/ai/estimate-materials', analysisData),
  },

  // Weather API
  weather: {
    getCurrent: (lat: number, lng: number) =>
      apiClient.get(`/weather/current?lat=${lat}&lng=${lng}`),
    getForecast: (lat: number, lng: number) =>
      apiClient.get(`/weather/forecast?lat=${lat}&lng=${lng}`),
  },

  // Analytics
  analytics: {
    getDashboardStats: () => apiClient.get('/analytics/dashboard'),
    getReportTrends: (timeframe: string) =>
      apiClient.get(`/analytics/trends?timeframe=${timeframe}`),
    getLocationStats: () => apiClient.get('/analytics/locations'),
  },
};

// OpenWeatherMap API (direct call)
const WEATHER_API_KEY = 'your_openweathermap_api_key'; // Replace with actual key

export const weatherAPI = {
  getCurrentWeather: async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Weather API error:', error);
      throw error;
    }
  },

  getWeatherForecast: async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Weather forecast API error:', error);
      throw error;
    }
  },
};

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: 'your_cloud_name', // Replace with your Cloudinary cloud name
  uploadPreset: 'your_upload_preset', // Replace with your upload preset
  apiKey: 'your_api_key', // Replace with your API key
};

export default apiClient;