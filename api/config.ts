import { z } from 'zod'

const Config = z.object({
  port: z.number(),
})

export type Config = z.infer<typeof Config>

function newConfig(): Config {
  return Config.parse({
    port: Number(process.env.PORT),
  })
}

export default newConfig
