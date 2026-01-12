import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { newDbConfig } from './api/config/config.ts'
import { newDB } from './api/db/db.ts'

const conf = newDbConfig()

const db = newDB(conf.dbFileName!)

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
})
