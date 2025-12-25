import { apiService } from './api';
import { 
  Hospital, 
  CreateHospitalData, 
  UpdateHospitalData,
  HospitalQueryParams,
  HospitalStatistics,
  ApiResponse,
  PaginatedResponse
} from '@/types';

export const hospitalService = {
  // Get all hospitals with pagination and filters
  getAllHospitals: async (params?: HospitalQueryParams): Promise<PaginatedResponse<Hospital>> => {
    const response = await apiService.get<ApiResponse<PaginatedResponse<Hospital>>>(
      'admin/hospital/list',
      { params }
    );
    return response.data.data;
  },

  // Get hospital by ID
  getHospitalById: async (id: string): Promise<Hospital> => {
    const response = await apiService.get<ApiResponse<Hospital>>(
      `/admin/hospital/${id}`
    );
    return response.data.data;
  },

  // Get nearby hospitals
  getNearbyHospitals: async (latitude: number, longitude: number, radius: number = 10): Promise<Hospital[]> => {
    const response = await apiService.get<ApiResponse<Hospital[]>>(
      '/admin/hospital/nearby',
      { 
        params: { latitude, longitude, radius } 
      }
    );
    return response.data.data;
  },

  // Get hospital statistics
  getHospitalStatistics: async (id: string): Promise<HospitalStatistics> => {
    const response = await apiService.get<ApiResponse<HospitalStatistics>>(
      `/admin/hospital/${id}/statistics`
    );
    return response.data.data;
  },

  // Create hospital (Super Admin only)
  createHospital: async (data: CreateHospitalData): Promise<Hospital> => {
    const response = await apiService.post<ApiResponse<Hospital>>(
      '/admin/hospital/add',
      data
    );
    return response.data.data;
  },

  // Update hospital
  updateHospital: async (id: string, data: UpdateHospitalData): Promise<Hospital> => {
    const response = await apiService.put<ApiResponse<Hospital>>(
      `/admin/hospital/${id}`,
      data
    );
    return response.data.data;
  },

  // Update hospital status
  updateHospitalStatus: async (id: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'): Promise<Hospital> => {
    const response = await apiService.patch<ApiResponse<Hospital>>(
      `/admin/hospital/${id}/status`,
      { status }
    );
    return response.data.data;
  },

  // Update bed availability
  updateBedAvailability: async (id: string, availableBeds: number): Promise<Hospital> => {
    const response = await apiService.patch<ApiResponse<Hospital>>(
      `/admin/hospital/${id}/beds`,
      { availableBeds }
    );
    return response.data.data;
  },

  // Delete hospital
  deleteHospital: async (id: string): Promise<void> => {
    await apiService.delete(`/admin/hospital/${id}`);
  },
};
