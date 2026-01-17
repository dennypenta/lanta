import newConfig from './config/config.ts'
import { newRPC } from './router.ts'

const config = newConfig()

// Create oRPC RPC handler
const rpcHandler = newRPC(config)

const server = Bun.serve({
  port: config.port,
  routes: { '/health': new Response(null) },
  fetch: async (req) => {
    // Handle oRPC requests with request headers in context
    const result = await rpcHandler.handle(req, {
      context: {
        reqHeaders: req.headers,
      },
    })
    if (result.matched) {
      return result.response
    }

    // 404 fallback
    return new Response(null, { status: 404 })
  },
})

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
