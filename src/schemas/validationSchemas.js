/**
 * Validation Schemas using Zod
 * Used with react-hook-form for form validation
 */

import { z } from 'zod'

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
})

/**
 * Signup form schema
 */
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
})

/**
 * Event creation schema
 */
export const eventSchema = z.object({
  name: z
    .string()
    .min(1, 'Event name is required')
    .min(3, 'Event name must be at least 3 characters')
    .max(100, 'Event name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  event_date: z.string().optional(),
  event_time: z.string().optional(),
  end_time: z.string().optional(),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  tip_presets: z
    .array(z.number().positive().max(10000))
    .min(1, 'At least one tip preset is required')
    .max(10, 'Maximum 10 tip presets allowed'),
  thank_you_message: z
    .string()
    .max(200, 'Thank you message must be less than 200 characters')
    .optional(),
})

/**
 * Tip form schema
 */
export const tipSchema = z.object({
  amount: z
    .number()
    .positive('Tip amount must be greater than 0')
    .min(0.01, 'Minimum tip is $0.01')
    .max(10000, 'Maximum tip is $10,000'),
  tipperName: z
    .string()
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  message: z
    .string()
    .max(500, 'Message must be less than 500 characters')
    .optional(),
})

/**
 * Profile update schema
 */
export const profileSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  avatar_url: z.string().url('Invalid URL format').optional().or(z.literal('')),
})

/**
 * Payout profile schema
 */
export const payoutProfileSchema = z.object({
  method_type: z.enum(['bank', 'stripe', 'paypal', 'venmo', 'cashapp']),
  account_name: z.string().min(1, 'Account name is required'),
  account_details: z.record(z.any()),
})

