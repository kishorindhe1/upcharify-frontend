// src/services/userService.ts
import {
  HospitalAssignment,
  HospitalAssignmentFormData,
  MasterUser,
  UserFormData,
  UserListResponse,
  UserQueryParams,
  UserStatus,
} from '@/types/userTypes';
import apiClient from './api';
const API_PATH = '/admin/users'; // Base


export const userService = {
  /**
   * Get all users with filters and pagination
   */
  async getAllUsers(params: UserQueryParams): Promise<UserListResponse> {
    const response = await apiClient.get(`${API_PATH}/list`, { params });
    return response.data.data;
  },

  /**
   * Get user by ID (includes hospital assignments)
   */
  async getUserById(id: string): Promise<MasterUser> {
    const response = await apiClient.get(`${API_PATH}/${id}`);
    return response.data.data;
  },

  /**
   * Create new user (with optional hospital assignment)
   */
  async createUser(data: UserFormData): Promise<MasterUser> {
    const response = await apiClient.post(`${API_PATH}/add`, data);
    return response.data.data;
  },

  /**
   * Update user (common profile fields)
   */
  async updateUser(id: string, data: Partial<UserFormData>): Promise<MasterUser> {
    const response = await apiClient.put(`${API_PATH}/${id}`, data);
    return response.data.data;
  },

  /**
   * Update user status
   */
  async updateUserStatus(id: string, status: UserStatus): Promise<MasterUser> {
    const response = await apiClient.patch(`${API_PATH}/${id}/status`, { status });
    return response.data.data;
  },

  /**
   * Delete user (soft delete)
   */
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`${API_PATH}/${id}`);
  },

  // ==================== Hospital Assignment Methods ====================

  /**
   * Get all hospitals for a user
   */
  async getUserHospitals(userId: string): Promise<HospitalAssignment[]> {
    const response = await apiClient.get(`${API_PATH}/${userId}/hospitals`);
    return response.data.data;
  },

  /**
   * Assign user to a hospital
   */
  async assignUserToHospital(
    userId: string,
    data: HospitalAssignmentFormData
  ): Promise<HospitalAssignment> {
    const response = await apiClient.post(`${API_PATH}/${userId}/hospitals`, data);
    return response.data.data;
  },

  /**
   * Update user's hospital role data
   */
  async updateUserHospitalRole(
    userId: string,
    hospitalId: string,
    data: Partial<HospitalAssignmentFormData>
  ): Promise<HospitalAssignment> {
    const response = await apiClient.put(
      `${API_PATH}/${userId}/hospitals/${hospitalId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Remove user from hospital (soft delete)
   */
  async removeUserFromHospital(userId: string, hospitalId: string): Promise<void> {
    await apiClient.delete(`${API_PATH}/${userId}/hospitals/${hospitalId}`);
  },

  /**
   * Set primary hospital for user
   */
  async setPrimaryHospital(userId: string, hospitalId: string): Promise<void> {
    await apiClient.patch(`${API_PATH}/${userId}/hospitals/primary`, { hospitalId });
  },
};

// Hospital service (for fetching hospital list in forms)
export const hospitalService = {
  /**
   * Get all hospitals for dropdown
   */
  async getAllHospitals(): Promise<any[]> {
    const response = await apiClient.get('/admin/hospital/list', {
      params: { limit: 1000, status: 'active' },
    });
    return response.data.data.records || [];
  },

  /**
   * Get departments by hospital
   */
  async getDepartmentsByHospital(hospitalId: string): Promise<any[]> {
    const response = await apiClient.get(`/admin/hospitals/${hospitalId}/departments`);
    return response.data.data || [];
  },
};