// src/api/endpoints/appointments.ts
import type {
  Appointment,
  AppointmentListQuery,
  AppointmentListResponse,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  UpdateAppointmentStatusRequest,
  CancelAppointmentRequest,
  RescheduleAppointmentRequest,
  AppointmentStatsResponse,
  DoctorAvailabilityResponse,
} from '@/types/appointment.types';
import apiClient from './api';

export const appointmentsAPI = {
  /**
   * List all appointments with filters
   */
  list: (query?: AppointmentListQuery) => {
    return apiClient.get<AppointmentListResponse>('/super-admin/appointments', { params: query });
  },

  /**
   * Get appointment by ID
   */
  getById: (id: string) => {
    return apiClient.get<Appointment>(`/super-admin/appointments/${id}`);
  },

  /**
   * Create new appointment
   */
  create: (data: CreateAppointmentRequest) => {
    return apiClient.post<Appointment>('/super-admin/appointments', data);
  },

  /**
   * Update appointment
   */
  update: (id: string, data: UpdateAppointmentRequest) => {
    return apiClient.put<Appointment>(`/super-admin/appointments/${id}`, data);
  },

  /**
   * Update appointment status
   */
  updateStatus: (id: string, data: UpdateAppointmentStatusRequest) => {
    return apiClient.put<Appointment>(`/super-admin/appointments/${id}/status`, data);
  },

  /**
   * Cancel appointment
   */
  cancel: (id: string, data: CancelAppointmentRequest) => {
    return apiClient.post<Appointment>(`/super-admin/appointments/${id}/cancel`, data);
  },

  /**
   * Reschedule appointment
   */
  reschedule: (id: string, data: RescheduleAppointmentRequest) => {
    return apiClient.post<Appointment>(`/super-admin/appointments/${id}/reschedule`, data);
  },

  /**
   * Confirm appointment
   */
  confirm: (id: string) => {
    return apiClient.post<Appointment>(`/super-admin/appointments/${id}/confirm`);
  },

  /**
   * Mark as no-show
   */
  markNoShow: (id: string) => {
    return apiClient.post<Appointment>(`/super-admin/appointments/${id}/no-show`);
  },

  /**
   * Complete appointment
   */
  complete: (id: string, data: { diagnosis?: string; prescription?: string; notes?: string }) => {
    return apiClient.post<Appointment>(`/super-admin/appointments/${id}/complete`, data);
  },

  /**
   * Delete appointment
   */
  delete: (id: string) => {
    return apiClient.delete(`/super-admin/appointments/${id}`);
  },

  /**
   * Get appointment statistics
   */
  getStats: () => {
    return apiClient.get<AppointmentStatsResponse>('/super-admin/appointments/stats');
  },

  /**
   * Get doctor availability for a specific date
   */
  getDoctorAvailability: (doctorId: string, hospitalId: string, date: string) => {
    return apiClient.get<DoctorAvailabilityResponse>(
      `/super-admin/appointments/availability/${doctorId}`,
      { params: { hospitalId, date } }
    );
  },

  /**
   * Get appointments for calendar view
   */
  getCalendarEvents: (params: { startDate: string; endDate: string; doctorId?: string; hospitalId?: string }) => {
    return apiClient.get<Appointment[]>('/super-admin/appointments/calendar', { params });
  },

  /**
   * Get today's appointments
   */
  getToday: () => {
    const today = new Date().toISOString().split('T')[0];
    return apiClient.get<AppointmentListResponse>('/super-admin/appointments', {
      params: { fromDate: today, toDate: today, limit: 100 },
    });
  },

  /**
   * Get upcoming appointments
   */
  getUpcoming: (limit = 10) => {
    const today = new Date().toISOString().split('T')[0];
    return apiClient.get<AppointmentListResponse>('/super-admin/appointments', {
      params: { 
        fromDate: today, 
        status: 'scheduled,confirmed',
        sortBy: 'appointmentDate',
        sortOrder: 'asc',
        limit,
      },
    });
  },
};