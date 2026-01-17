import { z } from 'zod'

const LogLevel: Record<string, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
}

const Config = z.object({
  port: z.number(),
  dbFileName: z.string(),
  corsOrigin: z.string(),
  logLevel: z.number().optional(),
})

export type Config = z.infer<typeof Config>

export function newConfig(): Config {
  const logLevel = process.env.LOG_LEVEL
    ? LogLevel[process.env.LOG_LEVEL!.toUpperCase()]
    : LogLevel.INFO

  return Config.parse({
    port: Number(process.env.PORT),
    dbFileName: process.env.DB_FILE_NAME,
    corsOrigin: process.env.CORS_ORIGIN,
    logLevel: logLevel,
  })
}

export function newDbConfig(): Partial<Config> {
  return Config.pick({ dbFileName: true }).parse({
    dbFileName: process.env.DB_FILE_NAME,
  })
}

export default newConfig
