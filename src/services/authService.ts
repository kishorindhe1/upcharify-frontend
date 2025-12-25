import { apiService } from './api';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  ForgotPasswordData, 
  ResetPasswordData,
  ApiResponse 
} from '@/types';

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiService.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiService.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    return response.data.data;
  },

  // Forgot Password
  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await apiService.post<ApiResponse<{ message: string }>>(
      '/auth/forgot-password',
      data
    );
    return response.data.data;
  },

  // Reset Password
  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await apiService.post<ApiResponse<{ message: string }>>(
      '/auth/reset-password',
      data
    );
    return response.data.data;
  },

  // Verify Email
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await apiService.post<ApiResponse<{ message: string }>>(
      '/auth/verify-email',
      { token }
    );
    return response.data.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiService.post('/auth/logout');
  },

  // Refresh Token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiService.post<ApiResponse<AuthResponse>>(
      '/auth/refresh-token',
      { refreshToken }
    );
    return response.data.data;
  },
};
