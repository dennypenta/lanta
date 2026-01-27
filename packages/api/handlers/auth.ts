import { Elysia } from 'elysia'

import {
  authEnterResponseSchema,
  profileResponseSchema,
  signInInputSchema,
  signOutResponseSchema,
  signUpInputSchema,
  type AuthEnterResponse,
  type ProfileResponse,
  type SignOutResponse,
  type UserProfile,
} from '@lanta/rpc/schemas'

import { auth } from '../auth.config.ts'

function mapUserToProfile(user: {
  id: string
  name: string
  email: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}): UserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }
}

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post(
    '/sign-up',
    async ({ body, request, set }): Promise<AuthEnterResponse> => {
      const result = await auth.api.signUpEmail({
        body: {
          name: body.name,
          email: body.email,
          password: body.password,
        },
        headers: request.headers,
        returnHeaders: true,
      })

      const cookies = result.headers?.getSetCookie() ?? []
      for (const cookie of cookies) {
        set.headers['set-cookie'] = cookie
      }

      return {
        user: mapUserToProfile(result.response.user),
      }
    },
    {
      body: signUpInputSchema,
      response: authEnterResponseSchema,
    },
  )
  .post(
    '/sign-in',
    async ({ body, request, set }): Promise<AuthEnterResponse> => {
      const result = await auth.api.signInEmail({
        body: {
          email: body.email,
          password: body.password,
        },
        headers: request.headers,
        returnHeaders: true,
      })

      const cookies = result.headers?.getSetCookie() ?? []
      for (const cookie of cookies) {
        set.headers['set-cookie'] = cookie
      }

      return {
        user: mapUserToProfile(result.response.user),
      }
    },
    {
      body: signInInputSchema,
      response: authEnterResponseSchema,
    },
  )
  .post(
    '/sign-out',
    async ({ request, set }): Promise<SignOutResponse> => {
      const result = await auth.api.signOut({
        headers: request.headers,
        returnHeaders: true,
      })

      const cookies = result.headers?.getSetCookie() ?? []
      for (const cookie of cookies) {
        set.headers['set-cookie'] = cookie
      }

      return { success: result.response.success }
    },
    {
      response: signOutResponseSchema,
    },
  )
  .get(
    '/profile',
    async ({ request }): Promise<ProfileResponse> => {
      const session = await auth.api.getSession({
        headers: request.headers,
      })

      if (!session) {
        return null
      }

      return mapUserToProfile(session.user)
    },
    {
      response: profileResponseSchema,
    },
  )
