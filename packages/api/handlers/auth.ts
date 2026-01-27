import { Elysia, t } from 'elysia'

import { auth } from '../auth.config.ts'

// Helper to map Better Auth user to our profile shape
function mapUserToProfile(user: {
  id: string
  name: string
  email: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

// Auth routes as Elysia plugin
export const authRoutes = new Elysia({ prefix: '/auth' })
  .post(
    '/sign-up',
    async ({ body, request, set }) => {
      const result = await auth.api.signUpEmail({
        body: {
          name: body.name,
          email: body.email,
          password: body.password,
        },
        headers: request.headers,
        returnHeaders: true,
      })

      // Copy session cookies to response
      const cookies = result.headers?.getSetCookie() ?? []
      for (const cookie of cookies) {
        set.headers['set-cookie'] = cookie
      }

      return {
        user: mapUserToProfile(result.response.user),
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 4 }),
      }),
    },
  )
  .post(
    '/sign-in',
    async ({ body, request, set }) => {
      const result = await auth.api.signInEmail({
        body: {
          email: body.email,
          password: body.password,
        },
        headers: request.headers,
        returnHeaders: true,
      })

      // Copy session cookies to response
      const cookies = result.headers?.getSetCookie() ?? []
      for (const cookie of cookies) {
        set.headers['set-cookie'] = cookie
      }

      return {
        user: mapUserToProfile(result.response.user),
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 4 }),
      }),
    },
  )
  .post('/sign-out', async ({ request, set }) => {
    const result = await auth.api.signOut({
      headers: request.headers,
      returnHeaders: true,
    })

    // Copy cookies to clear session
    const cookies = result.headers?.getSetCookie() ?? []
    for (const cookie of cookies) {
      set.headers['set-cookie'] = cookie
    }

    return { success: result.response.success }
  })
  .get('/profile', async ({ request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return null
    }

    return mapUserToProfile(session.user)
  })
