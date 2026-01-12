import newConfig from './config/config.ts'

const config = newConfig()

const server = Bun.serve({
  port: config.port,
  fetch(req) {
    const url = new URL(req.url)

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': config.corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400', // 24 hours
    }

    // Security headers
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    }

    const headers = { ...corsHeaders, ...securityHeaders }

    // Handle OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers })
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(null, { status: 200, headers })
    }

    // 404 for undefined routes
    return new Response('Not Found', { status: 404, headers })
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
