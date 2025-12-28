// src/schemas/user.schema.ts
import { z } from 'zod';
import { UserRole, Gender } from '@/types/user.types';

/**
 * Phone validation - Indian format
 */
const phoneRegex = /^\+91[6-9]\d{9}$/;

/**
 * Password validation
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

/**
 * Create User Schema
 */
export const createUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Phone must be in format: +91XXXXXXXXXX'),
  
  password: z
    .string()
    .optional()
    .refine((val) => {
      // Password is optional, but if provided, must meet requirements
      if (!val || val === '') return true;
      return passwordRegex.test(val);
    }, {
      message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
    }),
  
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  
  dateOfBirth: z
    .date()
    .optional()
    .nullable(),
  
  gender: z
    .nativeEnum(Gender)
    .optional()
    .nullable(),
  
  role: z
    .nativeEnum(UserRole, {
      required_error: 'Role is required',
    }),
  
  hospitalId: z
    .string()
    .uuid('Invalid hospital ID')
    .optional()
    .nullable(),
}).refine((data) => {
  // Email is required for non-patient roles
  if (data.role !== UserRole.PATIENT) {
    return !!data.email && data.email.length > 0;
  }
  return true;
}, {
  message: 'Email is required for doctors, hospital admins, and super admins',
  path: ['email'],
}).refine((data) => {
  // Password is required for non-patient roles
  if (data.role !== UserRole.PATIENT) {
    return !!data.password && data.password.length > 0;
  }
  return true;
}, {
  message: 'Password is required for doctors, hospital admins, and super admins',
  path: ['password'],
});

/**
 * Update User Schema
 */
export const updateUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  
  phone: z
    .string()
    .regex(phoneRegex, 'Phone must be in format: +91XXXXXXXXXX')
    .optional(),
  
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .optional(),
  
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .optional(),
  
  dateOfBirth: z
    .date()
    .optional()
    .nullable(),
  
  gender: z
    .nativeEnum(Gender)
    .optional()
    .nullable(),
  
  profilePicture: z
    .string()
    .url('Invalid profile picture URL')
    .optional()
    .nullable(),
});

/**
 * Update User Status Schema
 */
export const updateUserStatusSchema = z.object({
  status: z.enum(['active', 'inactive', 'suspended', 'pending'], {
    required_error: 'Status is required',
  }),
  
  reason: z
    .string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must not exceed 500 characters')
    .optional(),
});

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      passwordRegex,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/**
 * TypeScript types derived from schemas
 */
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type UpdateUserStatusFormData = z.infer<typeof updateUserStatusSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;