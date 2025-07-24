// src/utils/api.ts
import axios from "axios";

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // If we're in development mode, use localhost
  if (import.meta.env.DEV) {
    return "http://localhost:3001/api";
  }

  // In production, use the environment variable or try to detect Railway URL
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (envUrl) {
    return envUrl;
  }
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors and network issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    } else if (!error.response) {
      console.error("Network error - please check your connection");
    }
    return Promise.reject(error);
  }
);

export default api;
