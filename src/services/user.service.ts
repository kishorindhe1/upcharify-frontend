// src/api/endpoints/users.ts
import type {
  User,
  UserListQuery,
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserStatusRequest,
  UserStatsResponse,
} from '@/types/user.types';
import apiClient from './api';

export const usersAPI = {
  /**
   * List all users with filters
   */
  list: (query?: UserListQuery) => {
    return apiClient.get<UserListResponse>('/super-admin/users', { params: query });
  },

  /**
   * Get user by ID
   */
  getById: (id: string) => {
    return apiClient.get<User>(`/super-admin/users/${id}`);
  },

  /**
   * Create new user
   */
  create: (data: CreateUserRequest) => {
    return apiClient.post<User>('/super-admin/users', data);
  },

  /**
   * Update user
   */
  update: (id: string, data: UpdateUserRequest) => {
    return apiClient.put<User>(`/super-admin/users/${id}`, data);
  },

  /**
   * Update user status
   */
  updateStatus: (id: string, data: UpdateUserStatusRequest) => {
    return apiClient.put<User>(`/super-admin/users/${id}/status`, data);
  },

  /**
   * Delete user
   */
  delete: (id: string) => {
    return apiClient.delete(`/super-admin/users/${id}`);
  },

  /**
   * Get user statistics
   */
  getStats: () => {
    return apiClient.get<UserStatsResponse>('/super-admin/users/stats');
  },

  /**
   * Verify user email
   */
  verifyEmail: (id: string) => {
    return apiClient.post<User>(`/super-admin/users/${id}/verify-email`);
  },

  /**
   * Verify user phone
   */
  verifyPhone: (id: string) => {
    return apiClient.post<User>(`/super-admin/users/${id}/verify-phone`);
  },

  /**
   * Reset user password
   */
  resetPassword: (id: string, newPassword: string) => {
    return apiClient.post(`/super-admin/users/${id}/reset-password`, { newPassword });
  },

  /**
   * Get users by role (for dropdowns)
   */
  getByRole: (role: string) => {
    return apiClient.get<User[]>(`/super-admin/users/role/${role}`);
  },
};