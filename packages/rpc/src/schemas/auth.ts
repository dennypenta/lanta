import { t } from 'elysia'

const minEmailLen = 3
const minPasswordLen = 4

export const userProfileSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String({ format: 'email' }),
  emailVerified: t.Boolean(),
  createdAt: t.String({ format: 'date-time' }),
  updatedAt: t.String({ format: 'date-time' }),
})

export const signUpInputSchema = t.Object({
  name: t.String({ minLength: 1, description: 'Name is required' }),
  email: t.String({
    format: 'email',
    minLength: minEmailLen,
    description: 'Invalid email address',
  }),
  password: t.String({
    minLength: minPasswordLen,
    description: 'Password must be at least 8 characters',
  }),
})

export const signInInputSchema = t.Object({
  email: t.String({
    format: 'email',
    minLength: minEmailLen,
    description: 'Invalid email address',
  }),
  password: t.String({ minLength: minPasswordLen, description: 'Password is required' }),
})

export const authEnterResponseSchema = t.Object({
  user: userProfileSchema,
})

export const signOutResponseSchema = t.Object({
  success: t.Boolean(),
})

export const profileResponseSchema = t.Union([userProfileSchema, t.Null()])

export type UserProfile = typeof userProfileSchema.static
export type SignUpInput = typeof signUpInputSchema.static
export type SignInInput = typeof signInInputSchema.static
export type AuthEnterResponse = typeof authEnterResponseSchema.static
export type SignOutResponse = typeof signOutResponseSchema.static
export type ProfileResponse = typeof profileResponseSchema.static
