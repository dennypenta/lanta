import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import newConfig from './config.ts'

const conf = newConfig()

const app = new Hono()

app.get('/health', (c) => {
  c.status(200)
  return c.text('')
})

const server = serve({
  fetch: app.fetch,
  port: conf.port,
})

console.debug(`server started on port=${conf.port}`)

// graceful shutdown
process.on('SIGINT', () => {
  server.close()
  process.exit(0)
})
process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})
