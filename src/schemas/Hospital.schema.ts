// src/schemas/hospital.schema.ts
import { z } from 'zod';

const phoneRegex = /^(\+91|91)?[6789]\d{9}$/;
const pincodeRegex = /^\d{6}$/;

export const createHospitalSchema = z.object({
  name: z
    .string()
    .min(3, 'Hospital name must be at least 3 characters')
    .max(200, 'Hospital name must not exceed 200 characters'),
  
  type: z.enum(['hospital', 'clinic', 'diagnostic_center'], {
    errorMap: () => ({ message: 'Please select a valid hospital type' }),
  }),
  
  email: z
    .string()
    .email('Please enter a valid email address'),
  
  phone: z
    .string()
    .regex(phoneRegex, 'Please enter a valid Indian phone number'),
  
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters'),
  
  city: z
    .string()
    .min(2, 'City name must be at least 2 characters'),
  
  state: z
    .string()
    .min(2, 'State name must be at least 2 characters'),
  
  country: z
    .string()
    .optional()
    .default('India'),
  
  pincode: z
    .string()
    .regex(pincodeRegex, 'Pincode must be 6 digits'),
  
  latitude: z
    .number()
    .min(-90)
    .max(90)
    .optional(),
  
  longitude: z
    .number()
    .min(-180)
    .max(180)
    .optional(),
  
  website: z
    .string()
    .url('Please enter a valid website URL')
    .optional()
    .or(z.literal('')),
  
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),
  
  facilities: z
    .array(z.string())
    .optional(),
  
  totalBeds: z
    .number()
    .int()
    .min(0, 'Total beds must be a positive number')
    .optional(),
  
  isEmergency: z
    .boolean()
    .optional()
    .default(false),
  
  is24x7: z
    .boolean()
    .optional()
    .default(false),
  
  adminEmail: z
    .string()
    .email()
    .optional()
    .or(z.literal('')),
  
  adminPhone: z
    .string()
    .regex(phoneRegex)
    .optional()
    .or(z.literal('')),
  
  adminFirstName: z
    .string()
    .min(2)
    .max(100)
    .optional(),
  
  adminLastName: z
    .string()
    .min(2)
    .max(100)
    .optional(),
  
  adminPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),
  
  commissionRate: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .default(12),
});

export const updateHospitalSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(200)
    .optional(),
  
  type: z
    .enum(['hospital', 'clinic', 'diagnostic_center'])
    .optional(),
  
  email: z
    .string()
    .email()
    .optional(),
  
  phone: z
    .string()
    .regex(phoneRegex)
    .optional(),
  
  address: z
    .string()
    .min(10)
    .optional(),
  
  city: z
    .string()
    .min(2)
    .optional(),
  
  state: z
    .string()
    .min(2)
    .optional(),
  
  pincode: z
    .string()
    .regex(pincodeRegex)
    .optional(),
  
  latitude: z
    .number()
    .min(-90)
    .max(90)
    .optional(),
  
  longitude: z
    .number()
    .min(-180)
    .max(180)
    .optional(),
  
  website: z
    .string()
    .url()
    .optional()
    .or(z.literal('')),
  
  description: z
    .string()
    .max(1000)
    .optional(),
  
  facilities: z
    .array(z.string())
    .optional(),
  
  totalBeds: z
    .number()
    .int()
    .min(0)
    .optional(),
  
  isEmergency: z
    .boolean()
    .optional(),
  
  is24x7: z
    .boolean()
    .optional(),
  
  commissionRate: z
    .number()
    .min(0)
    .max(100)
    .optional(),
});

export const updateHospitalStatusSchema = z.object({
  status: z.enum(['active', 'inactive', 'suspended', 'pending']),
  reason: z.string().max(500).optional(),
});

export const rejectHospitalSchema = z.object({
  reason: z
    .string()
    .min(10, 'Rejection reason must be at least 10 characters')
    .max(500, 'Rejection reason must not exceed 500 characters'),
  notifyAdmin: z.boolean().optional().default(true),
});

export type CreateHospitalFormData = z.infer<typeof createHospitalSchema>;
export type UpdateHospitalFormData = z.infer<typeof updateHospitalSchema>;
export type UpdateHospitalStatusFormData = z.infer<typeof updateHospitalStatusSchema>;
export type RejectHospitalFormData = z.infer<typeof rejectHospitalSchema>;