import { Type } from 'typebox'
import { Value } from 'typebox/value'

const LogLevel: Record<string, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
}

const Config = Type.Object({
  port: Type.Number(),
  dbFileName: Type.String(),
  corsOrigin: Type.String(),
  logLevel: Type.Optional(Type.Number()),
})

export type Config = Type.Static<typeof Config>

export function newConfig(): Config {
  const logLevel = process.env.LOG_LEVEL
    ? LogLevel[process.env.LOG_LEVEL!.toUpperCase()]
    : LogLevel.INFO

  return Value.Parse(Config, {
    port: Number(process.env.PORT),
    dbFileName: process.env.DB_FILE_NAME,
    corsOrigin: process.env.CORS_ORIGIN,
    logLevel: logLevel,
  })
}

const DbConfig = Type.Object({
  dbFileName: Type.String(),
})

export function newDbConfig(): Partial<Config> {
  return Value.Parse(DbConfig, {
    dbFileName: process.env.DB_FILE_NAME,
  })
}

export default newConfig
