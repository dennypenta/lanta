import { defineConfig } from 'drizzle-kit'

import { newDbConfig } from './api/config/config.ts'

const conf = newDbConfig()

export default defineConfig({
  out: 'api/db/migrations',
  schema: './api/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: conf.dbFileName!,
  },
})
