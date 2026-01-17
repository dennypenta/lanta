import { defineConfig } from 'drizzle-kit'

import { newDbConfig } from './config/config.ts'

const conf = newDbConfig()

export default defineConfig({
  out: 'db/migrations',
  schema: ['./db/schema.ts', './auth/schema.ts'],
  dialect: 'sqlite',
  dbCredentials: {
    url: conf.dbFileName!,
  },
})
