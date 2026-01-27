import { os } from '@orpc/server'
import type { ResponseHeadersPluginContext } from '@orpc/server/plugins'
import { Type } from 'typebox'

import {
  authEnterResponseSchema,
  signInInputSchema,
  signUpInputSchema,
  userProfileSchema,
} from '@lanta/rpc'

import { auth } from '../auth.config.ts'

// Context type that includes request headers (matches ORPCContext in router.ts)
export interface AuthContext extends ResponseHeadersPluginContext {
  reqHeaders?: Headers
}

// Base OS with auth context
const authBase = os.$context<AuthContext>()

// Helper to copy headers from Better Auth response to oRPC response
function copySetCookieHeaders(fromHeaders: Headers | null, toHeaders?: Headers) {
  if (!fromHeaders || !toHeaders) return
  const cookies = fromHeaders.getSetCookie()
  for (const cookie of cookies) {
    toHeaders.append('set-cookie', cookie)
  }
}

// Sign-up handler
export const signUp = authBase
  .input(signUpInputSchema)
  .output(authEnterResponseSchema)
  .handler(async ({ input, context }) => {
    const result = await auth.api.signUpEmail({
      body: {
        name: input.name,
        email: input.email,
        password: input.password,
      },
      headers: context.reqHeaders,
      returnHeaders: true,
    })

    copySetCookieHeaders(result.headers, context.resHeaders)

    return {
      type: 'enter' as const,
      user: {
        id: result.response.user.id,
        name: result.response.user.name,
        email: result.response.user.email,
        emailVerified: result.response.user.emailVerified,
        image: result.response.user.image ?? null,
        createdAt: result.response.user.createdAt,
        updatedAt: result.response.user.updatedAt,
      },
    }
  })

// Sign-in handler
export const signIn = authBase
  .input(signInInputSchema)
  .output(authEnterResponseSchema)
  .handler(async ({ input, context }) => {
    const result = await auth.api.signInEmail({
      body: {
        email: input.email,
        password: input.password,
      },
      headers: context.reqHeaders,
      returnHeaders: true,
    })

    copySetCookieHeaders(result.headers, context.resHeaders)

    return {
      type: 'enter' as const,
      user: {
        id: result.response.user.id,
        name: result.response.user.name,
        email: result.response.user.email,
        emailVerified: result.response.user.emailVerified,
        image: result.response.user.image ?? null,
        createdAt: result.response.user.createdAt,
        updatedAt: result.response.user.updatedAt,
      },
    }
  })

// Sign-out handler
export const signOut = authBase
  .output(Type.Object({ success: Type.Boolean() }))
  .handler(async ({ context }) => {
    const result = await auth.api.signOut({
      headers: context.reqHeaders,
      returnHeaders: true,
    })

    copySetCookieHeaders(result.headers, context.resHeaders)

    return { success: result.response.success }
  })

// Get profile handler
export const getProfile = authBase
  .output(Type.Union([userProfileSchema, Type.Null()]))
  .handler(async ({ context }) => {
    const session = await auth.api.getSession({
      headers: context.reqHeaders ?? new Headers(),
    })

    if (!session) {
      return null
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
      image: session.user.image ?? null,
      createdAt: session.user.createdAt,
      updatedAt: session.user.updatedAt,
    }
  })

export const authRouter = {
  signUp,
  signIn,
  signOut,
  getProfile,
}
