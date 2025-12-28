// src/schemas/appointment.schema.ts
import { AppointmentStatus, AppointmentType } from '@/types/appointment.types';
import { z } from 'zod';

/**
 * Time validation helper
 */
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

/**
 * Create Appointment Schema
 */
export const createAppointmentSchema = z.object({
  patientId: z
    .string()
    .uuid('Invalid patient ID')
    .min(1, 'Patient is required'),
  
  doctorId: z
    .string()
    .uuid('Invalid doctor ID')
    .min(1, 'Doctor is required'),
  
  hospitalId: z
    .string()
    .uuid('Invalid hospital ID')
    .min(1, 'Hospital is required'),
  
  appointmentDate: z
    .date({
      required_error: 'Appointment date is required',
    })
    .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: 'Appointment date cannot be in the past',
    }),
  
  startTime: z
    .string()
    .regex(timeRegex, 'Invalid time format (HH:mm)'),
  
  duration: z
    .number()
    .min(15, 'Duration must be at least 15 minutes')
    .max(240, 'Duration cannot exceed 4 hours')
    .optional()
    .default(30),
  
  type: z.nativeEnum(AppointmentType, {
    required_error: 'Appointment type is required',
  }),
  
  symptoms: z
    .string()
    .max(1000, 'Symptoms description too long')
    .optional(),
  
  notes: z
    .string()
    .max(500, 'Notes too long')
    .optional(),
});

/**
 * Update Appointment Schema
 */
export const updateAppointmentSchema = z.object({
  appointmentDate: z
    .date()
    .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: 'Appointment date cannot be in the past',
    })
    .optional(),
  
  startTime: z
    .string()
    .regex(timeRegex, 'Invalid time format (HH:mm)')
    .optional(),
  
  duration: z
    .number()
    .min(15, 'Duration must be at least 15 minutes')
    .max(240, 'Duration cannot exceed 4 hours')
    .optional(),
  
  type: z
    .nativeEnum(AppointmentType)
    .optional(),
  
  symptoms: z
    .string()
    .max(1000, 'Symptoms description too long')
    .optional(),
  
  notes: z
    .string()
    .max(500, 'Notes too long')
    .optional(),
});

/**
 * Update Appointment Status Schema
 */
export const updateAppointmentStatusSchema = z.object({
  status: z.nativeEnum(AppointmentStatus, {
    required_error: 'Status is required',
  }),
  
  diagnosis: z
    .string()
    .max(2000, 'Diagnosis too long')
    .optional(),
  
  prescription: z
    .string()
    .max(2000, 'Prescription too long')
    .optional(),
  
  notes: z
    .string()
    .max(1000, 'Notes too long')
    .optional(),
});

/**
 * Cancel Appointment Schema
 */
export const cancelAppointmentSchema = z.object({
  reason: z
    .string()
    .min(10, 'Cancellation reason must be at least 10 characters')
    .max(500, 'Cancellation reason too long'),
  
  cancelledBy: z
    .enum(['patient', 'doctor', 'admin'], {
      required_error: 'Please specify who is cancelling',
    }),
});

/**
 * Reschedule Appointment Schema
 */
export const rescheduleAppointmentSchema = z.object({
  appointmentDate: z
    .date({
      required_error: 'New appointment date is required',
    })
    .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: 'New appointment date cannot be in the past',
    }),
  
  startTime: z
    .string()
    .regex(timeRegex, 'Invalid time format (HH:mm)'),
  
  reason: z
    .string()
    .max(500, 'Reason too long')
    .optional(),
});

/**
 * TypeScript types derived from schemas
 */
export type CreateAppointmentFormData = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentFormData = z.infer<typeof updateAppointmentSchema>;
export type UpdateAppointmentStatusFormData = z.infer<typeof updateAppointmentStatusSchema>;
export type CancelAppointmentFormData = z.infer<typeof cancelAppointmentSchema>;
export type RescheduleAppointmentFormData = z.infer<typeof rescheduleAppointmentSchema>;