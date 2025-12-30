import apiClient from './api';
import type {
  Hospital,
  CreateHospitalRequest,
  UpdateHospitalRequest,
  HospitalListQuery,
  HospitalListResponse,
} from '@/types/hospital.types';

interface UpdateStatusRequest {
  status: string;
  reason?: string;
}

interface RejectHospitalRequest {
  reason: string;
  notifyAdmin?: boolean;
}

export const hospitalsAPI = {
  // List all hospitals
  list: async (query: HospitalListQuery): Promise<HospitalListResponse> => {
    const params = new URLSearchParams();

    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.search) params.append('search', query.search);
    if (query.city) params.append('city', query.city);
    if (query.state) params.append('state', query.state);
    if (query.type) params.append('type', query.type);
    if (query.status) params.append('status', query.status);
    if (query.verified !== undefined) params.append('verified', query.verified.toString());
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);

    return apiClient.get<HospitalListResponse>(
      `/super-admin/hospitals?${params.toString()}`
    );
  },

  // Get pending hospitals
  getPending: async (): Promise<Hospital[]> => {
    return apiClient.get('/super-admin/hospitals/pending');
  },

  // Get hospital by ID
  getById: async (id: string): Promise<Hospital> => {
    return apiClient.get(`/super-admin/hospitals/${id}`);
  },

  // Create hospital
  create: async (data: CreateHospitalRequest): Promise<Hospital> => {
    return apiClient.post('/super-admin/hospitals', data);
  },

  // Update hospital
  update: async (id: string, data: UpdateHospitalRequest): Promise<Hospital> => {
    return apiClient.put(`/super-admin/hospitals/${id}`, data);
  },

  // Verify hospital
  verify: async (id: string): Promise<Hospital> => {
    return apiClient.post(`/super-admin/hospitals/${id}/verify`);
  },

  // Reject hospital
  reject: async (id: string, data: RejectHospitalRequest): Promise<Hospital> => {
    return apiClient.post(`/super-admin/hospitals/${id}/reject`, data);
  },

  // Update hospital status
  updateStatus: async (id: string, data: UpdateStatusRequest): Promise<Hospital> => {
    return apiClient.put(`/super-admin/hospitals/${id}/status`, data);
  },

  // Delete hospital
  delete: async (id: string): Promise<null> => {
    return apiClient.delete(`/super-admin/hospitals/${id}`);
  },

  // Get hospital doctors
  getDoctors: async (id: string): Promise<any[]> => {
    return apiClient.get(`/super-admin/hospitals/${id}/doctors`);
  },

  // Get hospital statistics
  getStats: async (id: string): Promise<any> => {
    return apiClient.get(`/super-admin/hospitals/${id}/stats`);
  },
};
