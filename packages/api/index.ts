import { Elysia } from 'elysia'

import newConfig from './config/config.ts'
import { authRoutes } from './handlers/auth.ts'
import { securityHeadersMiddleware } from './middlewares/headers.ts'
import { loggingMiddleware } from './middlewares/logging.ts'

const config = newConfig()

const app = new Elysia()
  .use(securityHeadersMiddleware())
  .use(loggingMiddleware())
  .get('/health', () => 'Hello Elysia')
  .use(authRoutes)
  .listen(config.port)

const server = app.server!

console.log(`Server running at ${server.url}`)

// Export app type for Eden Treaty client
export type App = typeof app

// graceful shutdown
const handleShutdown = () => {
  setTimeout(() => {
    console.warn('shutdown timeout, force exit')
    process.exit(1)
  }, 10 * 1000)

  console.log('server stopping')
  server.stop().then(() => {
    process.exit(0)
  })
}
process.on('SIGINT', handleShutdown)
process.on('SIGTERM', handleShutdown)
