// src/types/appointment.types.ts

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

export enum AppointmentType {
  IN_PERSON = 'in_person',
  VIDEO = 'video',
  PHONE = 'phone',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  appointmentDate: string; // ISO date string
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  duration: number; // in minutes
  type: AppointmentType;
  status: AppointmentStatus;
  consultationFee: number;
  paymentStatus: PaymentStatus;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    profilePicture?: string;
  };
  doctor?: {
    id: string;
    userId: string;
    specialization: string;
    consultationFee: number;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      phone: string;
      email?: string;
      profilePicture?: string;
    };
  };
  hospital?: {
    id: string;
    name: string;
    address: string;
    phone: string;
  };
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  hospitalId: string;
  appointmentDate: string;
  startTime: string;
  duration?: number;
  type: AppointmentType;
  symptoms?: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  appointmentDate?: string;
  startTime?: string;
  duration?: number;
  type?: AppointmentType;
  symptoms?: string;
  notes?: string;
}

export interface UpdateAppointmentStatusRequest {
  status: AppointmentStatus;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
}

export interface CancelAppointmentRequest {
  reason: string;
  cancelledBy: string; // 'patient' | 'doctor' | 'admin'
}

export interface RescheduleAppointmentRequest {
  appointmentDate: string;
  startTime: string;
  reason?: string;
}

export interface AppointmentListQuery {
  page?: number;
  limit?: number;
  search?: string;
  patientId?: string;
  doctorId?: string;
  hospitalId?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
  paymentStatus?: PaymentStatus;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AppointmentListResponse {
  appointments: Appointment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AppointmentStatsResponse {
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  byStatus: {
    scheduled: number;
    confirmed: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    no_show: number;
    rescheduled: number;
  };
  byType: {
    in_person: number;
    video: number;
    phone: number;
  };
  byPaymentStatus: {
    pending: number;
    paid: number;
    refunded: number;
    failed: number;
  };
  revenue: {
    total: number;
    pending: number;
    collected: number;
  };
  recentAppointments: Appointment[];
}

export interface DoctorAvailabilitySlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  appointmentId?: string;
}

export interface DoctorAvailabilityResponse {
  doctorId: string;
  hospitalId: string;
  date: string;
  slots: DoctorAvailabilitySlot[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  appointment: Appointment;
  color?: string;
}