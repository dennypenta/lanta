import { z } from 'zod'

const minEmailLen = 3
const minPasswordLen = 4

// User profile schema
export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Sign-up input schema
export const signUpInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email().min(minEmailLen, 'Invalid email address'),
  password: z.string().min(minPasswordLen, 'Password must be at least 8 characters'),
})

// Sign-in input schema
export const signInInputSchema = z.object({
  email: z.email().min(minEmailLen, 'Invalid email address'),
  password: z.string().min(minPasswordLen, 'Password is required'),
})

// Auth response schema (used for sign-up and sign-in)
export const authEnterResponseSchema = z.object({
  user: userProfileSchema,
})

// Export inferred types
export type UserProfile = z.infer<typeof userProfileSchema>
export type SignUpInput = z.infer<typeof signUpInputSchema>
export type SignInInput = z.infer<typeof signInInputSchema>
export type AuthEnterResponse = z.infer<typeof authEnterResponseSchema>
