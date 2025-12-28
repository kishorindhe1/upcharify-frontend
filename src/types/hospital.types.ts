// src/types/hospital.types.ts
export enum HospitalType {
  HOSPITAL = 'hospital',
  CLINIC = 'clinic',
  DIAGNOSTIC_CENTER = 'diagnostic_center',
}

export enum HospitalStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export interface Hospital {
  id: string;
  name: string;
  type: HospitalType;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  description?: string;
  facilities: string[];
  totalBeds: number;
  isEmergency: boolean;
  is24x7: boolean;
  status: HospitalStatus;
  verified: boolean;
  rating: number;
  totalReviews: number;
  commissionRate: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHospitalRequest {
  name: string;
  type: HospitalType;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  description?: string;
  facilities?: string[];
  totalBeds?: number;
  isEmergency?: boolean;
  is24x7?: boolean;
  adminEmail?: string;
  adminPhone?: string;
  adminFirstName?: string;
  adminLastName?: string;
  adminPassword?: string;
  commissionRate?: number;
}

export interface UpdateHospitalRequest {
  name?: string;
  type?: HospitalType;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  description?: string;
  facilities?: string[];
  totalBeds?: number;
  isEmergency?: boolean;
  is24x7?: boolean;
  commissionRate?: number;
}

export interface HospitalListQuery {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  state?: string;
  type?: HospitalType;
  status?: HospitalStatus;
  verified?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface HospitalListResponse {
  hospitals: Hospital[];
  pagination: PaginationMeta;
}