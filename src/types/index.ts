// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'HOSPITAL_ADMIN' | 'DOCTOR' | 'NURSE' | 'STAFF';
  hospitalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Hospital Types
export interface Hospital {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  totalBeds: number;
  availableBeds: number;
  emergencyService: boolean;
  ambulanceService: boolean;
  website?: string;
  description?: string;
  licenseNumber: string;
  establishedYear: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateHospitalData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  totalBeds: number;
  availableBeds: number;
  emergencyService: boolean;
  ambulanceService: boolean;
  website?: string;
  description?: string;
  licenseNumber: string;
  establishedYear: number;
}

export interface UpdateHospitalData extends Partial<CreateHospitalData> {}

export interface HospitalQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  state?: string;
  emergencyService?: boolean;
  ambulanceService?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface HospitalStatistics {
  totalPatients: number;
  activePatients: number;
  totalDoctors: number;
  totalStaff: number;
  bedOccupancyRate: number;
  emergencyCases: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Form State Types
export interface FormState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}
