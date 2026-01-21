import { Elysia } from 'elysia'
import newConfig from './config/config.ts'

const config = newConfig()

const app = new Elysia().get('/health', () => 'Hello Elysia').listen(config.port)
const server = app.server!

console.log(`Server running at ${server.url}`)

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
