import { os } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'

import {
  CORSPlugin,
  type ResponseHeadersPluginContext,
  SimpleCsrfProtectionHandlerPlugin,
} from '@orpc/server/plugins'
import { type Config } from './config/config.ts'
import { securityHeadersMiddleware } from './middlewares/headers.ts'

// interface ORPCContext extends ResponseHeadersPluginContext {}

export function newRPC(config: Config) {
  const secHeaders = securityHeadersMiddleware()
  const base = os.$context<ResponseHeadersPluginContext>().use(({ context, next }) => {
    for (const [key, val] of Object.entries(secHeaders)) {
      context.resHeaders?.set(key, val)
    }
    return next()
  })

  const hello = base.handler(async () => 'hello')
  const router = {
    hello,
  }

  return new RPCHandler(router, {
    strictGetMethodPluginEnabled: false, // Replace Strict Get Method Plugin
    plugins: [
      new CORSPlugin({
        origin: (_origin, _options) => config.corsOrigin,
        allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
        credentials: true,
        allowHeaders: ['Content-Type', 'Authorization'],
      }),
      new SimpleCsrfProtectionHandlerPlugin(),
    ],
  })
}
