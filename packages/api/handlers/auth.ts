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
} from '@lanta/rpc/schemas'

import { auth } from '../auth.config.ts'

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
        user: result.response.user,
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
        user: result.response.user,
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

      return session.user
    },
    {
      response: profileResponseSchema,
    },
  )
