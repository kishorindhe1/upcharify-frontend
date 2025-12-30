import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { ApiResponse } from '@/types';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    console.log('Request made with config:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data as ApiResponse<unknown>;

    // Auto-unwrap { success, data }
    if (res && typeof res === 'object' && 'data' in res) {
      return res.data;
    }

    // For APIs that don't follow wrapper
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // useAuthStore.getState().logout();
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Generic methods
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    apiClient.get<T>(url, config),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    apiClient.post<T>(url, data, config),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    apiClient.put<T>(url, data, config),
  
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    apiClient.patch<T>(url, data, config),
  
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    apiClient.delete<T>(url, config),
};

export default apiClient;
