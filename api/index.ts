import newConfig from './config/config.ts'

const config = newConfig()

const server = Bun.serve({
  port: config.port,
  routes: {
    '/health': new Response(null, { status: 200 }),
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
