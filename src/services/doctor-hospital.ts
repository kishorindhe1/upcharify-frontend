// src/api/endpoints/doctor-hospital.ts

import apiClient from "./api";

interface AssignDoctorRequest {
  doctorId: string;
  hospitalId: string;
  commissionRate: number;
  isPrimary?: boolean;
  status?: 'active' | 'inactive' | 'suspended';
}

interface UpdateCommissionRequest {
  commissionRate: number;
}

interface UpdateStatusRequest {
  status: 'active' | 'inactive' | 'suspended';
}

export const doctorHospitalAPI = {
  /**
   * Assign doctor to hospital
   */
  assignDoctor: (data: AssignDoctorRequest) => {
    return apiClient.post('/super-admin/doctors/assign', data);
  },

  /**
   * Remove doctor from hospital
   */
  removeDoctor: (doctorId: string, hospitalId: string) => {
    return apiClient.delete(`/super-admin/doctors/${doctorId}/${hospitalId}`);
  },

  /**
   * Get all doctors for a hospital
   */
  getHospitalDoctors: (hospitalId: string) => {
    return apiClient.get(`/super-admin/doctors/hospital/${hospitalId}`);
  },

  /**
   * Get all hospitals for a doctor
   */
  getDoctorHospitals: (doctorId: string) => {
    return apiClient.get(`/super-admin/doctors/doctor/${doctorId}`);
  },

  /**
   * Update commission rate
   */
  updateCommission: (doctorId: string, hospitalId: string, commissionRate: number) => {
    return apiClient.put(
      `/super-admin/doctors/${doctorId}/${hospitalId}/commission`,
      { commissionRate }
    );
  },

  /**
   * Set primary hospital for doctor
   */
  setPrimaryHospital: (doctorId: string, hospitalId: string) => {
    return apiClient.put(
      `/super-admin/doctors/${doctorId}/${hospitalId}/primary`
    );
  },

  /**
   * Update doctor-hospital status
   */
  updateStatus: (doctorId: string, hospitalId: string, status: string) => {
    return apiClient.put(
      `/super-admin/doctors/${doctorId}/${hospitalId}/status`,
      { status }
    );
  },

  /**
   * Get association details
   */
  getAssociation: (doctorId: string, hospitalId: string) => {
    return apiClient.get(`/super-admin/doctors/${doctorId}/${hospitalId}`);
  },
};