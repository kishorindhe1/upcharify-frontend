// src/schemas/doctor.schema.ts
import { z } from 'zod';


export const createDoctorSchema = z.object({
  userId: z
    .string({ required_error: 'User ID is required' })
    .min(1, 'Please select a user'),

  licenseNumber: z
    .string({ required_error: 'License number is required' })
    .min(5, 'License number must be at least 5 characters')
    .max(100, 'License number must not exceed 100 characters'),

  specialization: z
    .string({ required_error: 'Specialization is required' })
    .min(2, 'Specialization must be at least 2 characters')
    .max(100, 'Specialization must not exceed 100 characters'),

  experienceYears: z
    .number()
    .int('Experience must be a whole number')
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience cannot exceed 50 years')
    .optional(),

  qualification: z
    .string()
    .min(2, 'Qualification must be at least 2 characters')
    .max(255, 'Qualification is too long')
    .optional()
    .or(z.literal('')),

  consultationFee: z
    .number()
    .positive('Consultation fee must be positive')
    .max(100000, 'Consultation fee is too high')
    .optional(),

  bio: z
    .string()
    .max(1000, 'Bio must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
});

export const updateDoctorSchema = z.object({
  licenseNumber: z
    .string()
    .min(5)
    .max(100)
    .optional(),

  specialization: z
    .string()
    .min(2)
    .max(100)
    .optional(),

  experienceYears: z
    .number()
    .int()
    .min(0)
    .max(50)
    .optional(),

  qualification: z
    .string()
    .min(2)
    .max(255)
    .optional()
    .or(z.literal('')),

  consultationFee: z
    .number()
    .positive()
    .max(100000)
    .optional(),

  bio: z
    .string()
    .max(1000)
    .optional()
    .or(z.literal('')),

  available: z
    .boolean()
    .optional(),
});

export const verifyDoctorSchema = z.object({
  verified: z.boolean({ required_error: 'Verification status is required' }),
  verificationNotes: z.string().max(500).optional().or(z.literal('')),
});

export const rejectDoctorSchema = z.object({
  reason: z
    .string({ required_error: 'Rejection reason is required' })
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must not exceed 500 characters'),
  sendNotification: z.boolean().optional().default(true),
});

export const updateDoctorStatusSchema = z.object({
  status: z.enum(['active', 'inactive', 'suspended'], {
    required_error: 'Status is required',
  }),
  reason: z.string().max(500).optional().or(z.literal('')),
});

export type CreateDoctorFormData = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorFormData = z.infer<typeof updateDoctorSchema>;
export type VerifyDoctorFormData = z.infer<typeof verifyDoctorSchema>;
export type RejectDoctorFormData = z.infer<typeof rejectDoctorSchema>;
export type UpdateDoctorStatusFormData = z.infer<typeof updateDoctorStatusSchema>;