import { Database } from 'bun:sqlite'
import { BunSQLiteDatabase, drizzle } from 'drizzle-orm/bun-sqlite'

import { type Config } from '../config/config.ts'

export function newDB(conf: Config): BunSQLiteDatabase {
  const sqlite = new Database(conf.dbFileName)
  const db = drizzle({ client: sqlite })
  return db
}
