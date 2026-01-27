import { Elysia } from 'elysia'

export function securityHeadersMiddleware() {
  return new Elysia({ name: 'security-headers' }).onAfterHandle({ as: 'global' }, ({ set }) => {
    set.headers['X-Content-Type-Options'] = 'nosniff'
    set.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    set.headers['Cache-Control'] = 'no-store'
  })
}
