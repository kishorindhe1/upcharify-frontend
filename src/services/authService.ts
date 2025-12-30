import { apiService } from './api';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  ForgotPasswordData, 
  ResetPasswordData,
 
} from '@/types';

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    return response;
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>(
      '/auth/register',
      data
    );
    return response;
  },

  // Forgot Password
  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(
      '/auth/forgot-password',
      data
    );
    return response;
  },

  // Reset Password
  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(
      '/auth/reset-password',
      data
    );
    return response;
  },

  // Verify Email
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(
      '/auth/verify-email',
      { token }
    );
    return response;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiService.post('/auth/logout');
  },

  // Refresh Token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>(
      '/auth/refresh-token',
      { refreshToken }
    );
    return response;
  },
};
