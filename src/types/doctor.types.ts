// src/types/doctor.types.ts
export enum DoctorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export interface Doctor {
  id: string;
  userId: string;
  licenseNumber: string;
  specialization: string;
  experienceYears?: number;
  qualification?: string;
  consultationFee?: number;
  bio?: string;
  rating?: number;
  totalReviews?: number;
  available: boolean;
  verified: boolean;
  verifiedAt?: string;
  status: DoctorStatus;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    profilePicture?: string;
  };
  
  // Statistics
  stats?: {
    totalAppointments: number;
    totalRevenue: number;
    avgRating: number;
    reviewCount: number;
  };
}

export interface CreateDoctorRequest {
  userId: string;
  licenseNumber: string;
  specialization: string;
  experienceYears?: number;
  qualification?: string;
  consultationFee?: number;
  bio?: string;
}

export interface UpdateDoctorRequest {
  licenseNumber?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
  consultationFee?: number;
  bio?: string;
  available?: boolean;
}

export interface VerifyDoctorRequest {
  verified: boolean;
  verificationNotes?: string;
}

export interface RejectDoctorRequest {
  reason: string;
  sendNotification?: boolean;
}

export interface UpdateDoctorStatusRequest {
  status: DoctorStatus;
  reason?: string;
}

export interface DoctorListQuery {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  verified?: boolean;
  status?: DoctorStatus;
  available?: boolean;
  minExperience?: number;
  maxExperience?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DoctorListResponse {
  doctors: Doctor[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface DoctorPerformance {
  appointments: {
    total: number;
    completed: number;
    cancelled: number;
    noShow: number;
    completionRate: string;
    cancellationRate: string;
  };
  revenue: {
    total: number;
    commission: number;
    net: number;
    average: number;
  };
  ratings: {
    average: string;
    distribution: Record<number, number>;
    total: number;
  };
  patients: {
    total: number;
    returning: number;
    returnRate: string;
  };
}

export interface RevenueBreakdown {
  summary: {
    total: number;
    commission: number;
    net: number;
    transactions: number;
  };
  byMonth: Array<{
    month: string;
    total: number;
    commission: number;
    net: number;
  }>;
}

// Common specializations
export const SPECIALIZATIONS = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'General Practice',
  'Neurology',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Surgery',
  'Urology',
  'Other',
];