// src/api/endpoints/doctors.ts
import type {
  Doctor,
  DoctorListQuery,
  DoctorListResponse,
  CreateDoctorRequest,
  UpdateDoctorRequest,
  VerifyDoctorRequest,
  RejectDoctorRequest,
  UpdateDoctorStatusRequest,
  DoctorPerformance,
  RevenueBreakdown,
} from '@/types/doctor.types';
import apiClient from './api';

export const doctorsAPI = {
  /**
   * List all doctors with filters
   */
  list: async (query?: DoctorListQuery) => {
    const response = await apiClient.get<DoctorListResponse>('/super-admin/doctors', { params: query });
    return response.data;
  },

  /**
   * Get pending verification doctors
   */
  getPending: async () => {
    const response = await apiClient.get<Doctor[]>('/super-admin/doctors/pending-verification');
    return response.data;
  },

  /**
   * Get doctor by ID
   */
  getById: async (id: string) => {
    const response = await apiClient.get<Doctor>(`/super-admin/doctors/${id}`);
    return response.data;
  },

  /**
   * Create new doctor
   */
  create: async (data: CreateDoctorRequest) => {
    const response = await apiClient.post<Doctor>('/super-admin/doctors', data);
    return response.data;
  },

  /**
   * Update doctor
   */
  update: async (id: string, data: UpdateDoctorRequest) => {
    const response = await apiClient.put<Doctor>(`/super-admin/doctors/${id}`, data);
    return response.data;
  
  },

  /**
   * Verify doctor
   */
  verify: async (id: string, data: VerifyDoctorRequest) => {
    const response =   await apiClient.post<Doctor>(`/super-admin/doctors/${id}/verify`, data);
    return response.data;
  },

  /**
   * Reject doctor
   */
  reject: (id: string, data: RejectDoctorRequest) => {
    return apiClient.post<Doctor>(`/super-admin/doctors/${id}/reject`, data);
  },

  /**
   * Update doctor status
   */
  updateStatus: async (id: string, data: UpdateDoctorStatusRequest) => {
    const response = await apiClient.put<Doctor>(`/super-admin/doctors/${id}/status`, data);
    return response.data;
  },

  /**
   * Delete doctor
   */
  delete: (id: string) => {
    return apiClient.delete(`/super-admin/doctors/${id}`);
  },

  /**
   * Get doctor performance metrics
   */
  getPerformance:  async (id: string, query?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get<DoctorPerformance>(`/super-admin/doctors/${id}/performance`, {
      params: query,
    });
    return response.data;
  },
  

  /**
   * Get doctor appointments
   */
  getAppointments: async(id: string, query?: { page?: number; limit?: number; status?: string }) => {
    const response = await apiClient.get<{ appointments: any[]; pagination: any }>(`/super-admin/doctors/${id}/appointments`, {
      params: query,
    });
    return response.data;
  },    

  /**
   * Get doctor revenue breakdown
   */
  getRevenue: async (id: string, query?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get<RevenueBreakdown>(`/super-admin/doctors/${id}/revenue`, {
      params: query,
    });
    return response.data;
  },
};