import { z } from 'zod'

const Config = z.object({
  port: z.number(),
  dbFileName: z.string(),
})

export type Config = z.infer<typeof Config>

export function newConfig(): Config {
  return Config.parse({
    port: Number(process.env.PORT),
    dbFileName: process.env.DB_FILE_NAME,
  })
}

export function newDbConfig(): Partial<Config> {
  return Config.pick({ dbFileName: true }).parse({
    dbFileName: process.env.DB_FILE_NAME,
  })
}

export default newConfig
