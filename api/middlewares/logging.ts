import { os } from '@orpc/server'

export const LOG_LEVEL_DEBUG = 0
export const LOG_LEVEL_INFO = 1
export const LOG_LEVEL_WARN = 2
export const LOG_LEVEL_ERROR = 3

function shouldLog(current: number, target: number): boolean {
  return current <= target
}

export function loggingMiddleware(level: number = LOG_LEVEL_INFO) {
  return os.middleware(async ({ context: _context, next, path }) => {
    const start = performance.now()
    const pathStr = path.join('/')

    try {
      const result = await next({})
      const durationMs = (performance.now() - start).toFixed(2)

      if (shouldLog(level, LOG_LEVEL_INFO)) {
        console.info(`path=${pathStr} duration=${durationMs}ms`)
      }

      return result
    } catch (error) {
      const durationMs = (performance.now() - start).toFixed(2)

      console.info(`path=${pathStr} duration=${durationMs}ms error=${error}`)

      throw error
    }
  })
}
