import { z } from 'zod';

// Authentication Schemas
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
});

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s-()]+$/.test(val), 'Invalid phone number'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean()
    .refine((val) => val === true, 'You must agree to terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Hospital Schemas
export const hospitalSchema = z.object({
  name: z.string()
    .min(3, 'Hospital name must be at least 3 characters')
    .max(200, 'Hospital name is too long'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address is too long'),
  city: z.string()
    .min(2, 'City name must be at least 2 characters')
    .max(100, 'City name is too long'),
  state: z.string()
    .min(2, 'State name must be at least 2 characters')
    .max(100, 'State name is too long'),
  country: z.string()
    .min(2, 'Country name must be at least 2 characters')
    .max(100, 'Country name is too long'),
  zipCode: z.string()
    .min(4, 'ZIP code must be at least 4 characters')
    .max(10, 'ZIP code is too long'),
  latitude: z.number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude'),
  longitude: z.number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude'),
  totalBeds: z.number()
    .int('Total beds must be a whole number')
    .min(1, 'Total beds must be at least 1')
    .max(10000, 'Total beds cannot exceed 10,000'),
  availableBeds: z.number()
    .int('Available beds must be a whole number')
    .min(0, 'Available beds cannot be negative'),
  emergencyService: z.boolean(),
  ambulanceService: z.boolean(),
  website: z.string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),
  description: z.string()
    .max(1000, 'Description is too long')
    .optional(),
  licenseNumber: z.string()
    .min(5, 'License number must be at least 5 characters')
    .max(50, 'License number is too long'),
  establishedYear: z.number()
    .int('Established year must be a whole number')
    .min(1800, 'Invalid established year')
    .max(new Date().getFullYear(), 'Established year cannot be in the future'),
}).refine((data) => data.availableBeds <= data.totalBeds, {
  message: "Available beds cannot exceed total beds",
  path: ["availableBeds"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type HospitalFormData = z.infer<typeof hospitalSchema>;
