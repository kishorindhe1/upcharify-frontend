// src/types/user.types.ts
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  HOSPITAL_ADMIN = 'hospital_admin',
  DOCTOR = 'doctor',
  PATIENT = 'patient',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export interface User {
  id: string;
  email?: string;
  phone: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: Gender;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  profilePicture?: string;
  hospitalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email?: string;
  phone: string;
  password?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: Gender;
  role: UserRole;
  hospitalId?: string;
}

export interface UpdateUserRequest {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  profilePicture?: string;
}

export interface UpdateUserStatusRequest {
  status: UserStatus;
  reason?: string;
}

export interface UserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  hospitalId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserListResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UserStatsResponse {
  totalUsers: number;
  activeUsers: number;
  usersByRole: {
    super_admin: number;
    hospital_admin: number;
    doctor: number;
    patient: number;
  };
  recentUsers: User[];
  verificationStats: {
    emailVerified: number;
    phoneVerified: number;
    bothVerified: number;
    noneVerified: number;
  };
}