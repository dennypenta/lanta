import { Type } from 'typebox'

const minEmailLen = 3
const minPasswordLen = 4

// User profile schema
export const userProfileSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  emailVerified: Type.Boolean(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
})

// Sign-up input schema
export const signUpInputSchema = Type.Object({
  name: Type.String({ minLength: 1, description: 'Name is required' }),
  email: Type.String({
    format: 'email',
    minLength: minEmailLen,
    description: 'Invalid email address',
  }),
  password: Type.String({
    minLength: minPasswordLen,
    description: 'Password must be at least 8 characters',
  }),
})

// Sign-in input schema
export const signInInputSchema = Type.Object({
  email: Type.String({
    format: 'email',
    minLength: minEmailLen,
    description: 'Invalid email address',
  }),
  password: Type.String({ minLength: minPasswordLen, description: 'Password is required' }),
})

// Auth response schema (used for sign-up and sign-in)
export const authEnterResponseSchema = Type.Object({
  user: userProfileSchema,
})

// Export inferred types
export type UserProfile = Type.Static<typeof userProfileSchema>
export type SignUpInput = Type.Static<typeof signUpInputSchema>
export type SignInInput = Type.Static<typeof signInInputSchema>
export type AuthEnterResponse = Type.Static<typeof authEnterResponseSchema>
