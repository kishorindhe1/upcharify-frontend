// src/types/userTypes.ts

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  HOSPITAL_ADMIN = 'hospital_admin',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  PHARMACIST = 'pharmacist',
  LAB_TECHNICIAN = 'lab_technician',
  RADIOLOGIST = 'radiologist',
  RECEPTIONIST = 'receptionist',
  FRONT_DESK = 'front_desk',
  BILLING_STAFF = 'billing_staff',
  PATIENT = 'patient',
  RECIPIENT = 'recipient',
  CAREGIVER = 'caregiver',
  IT_SUPPORT = 'it_support',
  AUDITOR = 'auditor',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum ShiftType {
  MORNING = 'morning',
  EVENING = 'evening',
  NIGHT = 'night',
  ROTATING = 'rotating',
}

// Hospital Assignment interface
export interface HospitalAssignment {
  id: string;
  hospitalId: string;
  userId: string;
  
  // Doctor-specific
  specialization?: string;
  licenseNumber?: string;
  departmentId?: string;
  qualification?: string;
  experienceYears?: number;
  consultationFee?: number;
  bio?: string;
  available?: boolean;
  
  // Nurse-specific
  nursingLicenseNumber?: string;
  shift?: ShiftType;
  
  // Pharmacist-specific
  pharmacistLicenseNumber?: string;
  
  // Lab tech-specific
  labCertifications?: string;
  
  // Common
  employeeId?: string;
  joinedDate?: string;
  department?: string;
  isActive: boolean;
  isPrimary: boolean;
  
  // Relations
  hospital?: {
    id: string;
    name: string;
    city: string;
    state: string;
    phone?: string;
    email?: string;
  };
}

// Master User interface
export interface MasterUser {
  id: string;
  phone: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  bloodGroup?: string;
  dateOfBirth: string;
  gender?: Gender;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  isVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Hospital assignments
  hospitalRoles?: HospitalAssignment[];
}

// Form data for creating user
export interface UserFormData {
  phone: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  bloodGroup?: string;
  dateOfBirth: string;
  gender?: Gender;
  avatar?: string;
  role: UserRole;
  status?: UserStatus;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  
  // Hospital assignment (for staff roles)
  hospitalAssignment?: HospitalAssignmentFormData;
}

// Hospital assignment form data
export interface HospitalAssignmentFormData {
  hospitalId: string;
  isPrimary?: boolean;
  
  // Doctor fields
  specialization?: string;
  licenseNumber?: string;
  departmentId?: string;
  qualification?: string;
  experienceYears?: number;
  consultationFee?: number;
  bio?: string;
  
  // Nurse fields
  nursingLicenseNumber?: string;
  shift?: ShiftType;
  
  // Pharmacist fields
  pharmacistLicenseNumber?: string;
  
  // Lab tech fields
  labCertifications?: string;
  
  // Common fields
  employeeId?: string;
  joinedDate?: string;
  department?: string;
}

// Query params for user list
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  gender?: Gender;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  isVerified?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  
  // Hospital filters
  hospitalId?: string;
  specialization?: string;
  departmentId?: string;
  available?: boolean;
}

// Response types
export interface UserListResponse {
  records: MasterUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Helper function to check if role requires hospital assignment
export const isStaffRole = (role: UserRole): boolean => {
  return [
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.PHARMACIST,
    UserRole.LAB_TECHNICIAN,
    UserRole.RADIOLOGIST,
    UserRole.RECEPTIONIST,
    UserRole.FRONT_DESK,
    UserRole.BILLING_STAFF,
  ].includes(role);
};

// Helper to get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'Super Admin',
    [UserRole.HOSPITAL_ADMIN]: 'Hospital Admin',
    [UserRole.DOCTOR]: 'Doctor',
    [UserRole.NURSE]: 'Nurse',
    [UserRole.PHARMACIST]: 'Pharmacist',
    [UserRole.LAB_TECHNICIAN]: 'Lab Technician',
    [UserRole.RADIOLOGIST]: 'Radiologist',
    [UserRole.RECEPTIONIST]: 'Receptionist',
    [UserRole.FRONT_DESK]: 'Front Desk',
    [UserRole.BILLING_STAFF]: 'Billing Staff',
    [UserRole.PATIENT]: 'Patient',
    [UserRole.RECIPIENT]: 'Recipient',
    [UserRole.CAREGIVER]: 'Caregiver',
    [UserRole.IT_SUPPORT]: 'IT Support',
    [UserRole.AUDITOR]: 'Auditor',
  };
  return roleNames[role] || role;
};