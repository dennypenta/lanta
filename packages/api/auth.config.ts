import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { newDbConfig } from './config/config.ts'
import { newDB } from './db/db.ts'

const conf = newDbConfig()

const db = newDB(conf.dbFileName!)

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
  },
})
