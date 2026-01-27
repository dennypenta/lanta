import { Elysia } from 'elysia'

export const LOG_LEVEL_DEBUG = 0
export const LOG_LEVEL_INFO = 1
export const LOG_LEVEL_WARN = 2
export const LOG_LEVEL_ERROR = 3

function shouldLog(current: number, target: number): boolean {
  return current <= target
}

export function loggingMiddleware(level: number = LOG_LEVEL_INFO) {
  return new Elysia({ name: 'logging' })
    .derive({ as: 'global' }, () => ({
      requestStart: performance.now(),
    }))
    .onAfterHandle({ as: 'global' }, ({ path, requestStart }) => {
      if (shouldLog(level, LOG_LEVEL_INFO)) {
        const durationMs = (performance.now() - requestStart).toFixed(2)
        console.info(`path=${path} duration=${durationMs}ms`)
      }
    })
    .onError({ as: 'global' }, ({ path, error, requestStart }) => {
      const durationMs = requestStart ? (performance.now() - requestStart).toFixed(2) : 'unknown'
      console.error(`path=${path} duration=${durationMs}ms error=${error}`)
    })
}
