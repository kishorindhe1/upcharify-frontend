// src/utils/userValidation.ts
import { z } from 'zod';
import { UserRole, UserStatus, Gender, ShiftType } from '@/types/userTypes';

// Hospital assignment schema
export const hospitalAssignmentSchema = z.object({
  hospitalId: z.string().uuid('Please select a hospital'),
  isPrimary: z.boolean().optional(),
  
  // Doctor fields
  specialization: z.string().min(2, 'Specialization must be at least 2 characters').optional(),
  licenseNumber: z.string().min(2, 'License number must be at least 2 characters').optional(),
  departmentId: z.string().uuid('Invalid department').optional().or(z.literal('')),
  qualification: z.string().optional(),
  experienceYears: z.number().int().min(0).max(70).optional(),
  consultationFee: z.number().min(0).optional(),
  bio: z.string().optional(),
  
  // Nurse fields
  nursingLicenseNumber: z.string().min(2).optional(),
  shift: z.nativeEnum(ShiftType).optional(),
  
  // Pharmacist fields
  pharmacistLicenseNumber: z.string().min(2).optional(),
  
  // Lab tech fields
  labCertifications: z.string().optional(),
  
  // Common fields
  employeeId: z.string().max(50).optional(),
  joinedDate: z.string().optional(),
  department: z.string().max(100).optional(),
});

export type HospitalAssignmentFormData = z.infer<typeof hospitalAssignmentSchema>;

// User schema
export const userSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Phone must be in E.164 format (e.g., +919876543210)'),
  email: z
    .string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    )
    .optional()
    .or(z.literal('')),
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(100)
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(100)
    .optional(),
  name: z.string().min(2).max(255).optional(),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.nativeEnum(Gender).optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus).optional(),
  phoneVerified: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  
  // Hospital assignment (conditional)
  hospitalAssignment: hospitalAssignmentSchema.optional(),
}).superRefine((data, ctx) => {
  // Validate hospital assignment for staff roles
  const staffRoles = [
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.PHARMACIST,
    UserRole.LAB_TECHNICIAN,
    UserRole.RADIOLOGIST,
    UserRole.RECEPTIONIST,
    UserRole.FRONT_DESK,
    UserRole.BILLING_STAFF,
  ];
  
  if (staffRoles.includes(data.role) && !data.hospitalAssignment?.hospitalId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Hospital assignment is required for staff roles',
      path: ['hospitalAssignment', 'hospitalId'],
    });
  }
  
  // Role-specific validations
  if (data.role === UserRole.DOCTOR && data.hospitalAssignment) {
    if (!data.hospitalAssignment.specialization) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Specialization is required for doctors',
        path: ['hospitalAssignment', 'specialization'],
      });
    }
    if (!data.hospitalAssignment.licenseNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'License number is required for doctors',
        path: ['hospitalAssignment', 'licenseNumber'],
      });
    }
  }
  
  if (data.role === UserRole.NURSE && data.hospitalAssignment) {
    if (!data.hospitalAssignment.nursingLicenseNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Nursing license number is required for nurses',
        path: ['hospitalAssignment', 'nursingLicenseNumber'],
      });
    }
  }
  
  if (data.role === UserRole.PHARMACIST && data.hospitalAssignment) {
    if (!data.hospitalAssignment.pharmacistLicenseNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Pharmacist license number is required',
        path: ['hospitalAssignment', 'pharmacistLicenseNumber'],
      });
    }
  }
});

export type UserFormData = z.infer<typeof userSchema>;

// Update user schema (for editing)
export const updateUserSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  email: z.string().email().optional().or(z.literal('')),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .optional()
    .or(z.literal('')),
  firstName: z.string().min(2).max(100).optional(),
  lastName: z.string().min(2).max(100).optional(),
  name: z.string().min(2).max(255).optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  phoneVerified: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;