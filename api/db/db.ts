import { Database } from 'bun:sqlite'
import { BunSQLiteDatabase, drizzle } from 'drizzle-orm/bun-sqlite'

export interface DBConfig {
  /** Database file path */
  dbFileName: string
  /** Enable WAL mode for better concurrent access (default: true) */
  walMode?: boolean
  /** Timeout in milliseconds for busy handler (default: 5000) */
  busyTimeout?: number
  /** Enable strict mode for data integrity (default: true) */
  strictMode?: boolean
  /** Cache size in KB, negative values for pages (default: -64000, ~64MB) */
  cacheSize?: number
}

export function newDB(config: string | DBConfig): BunSQLiteDatabase {
  // Support both string and config object for backwards compatibility
  const dbConfig: DBConfig = typeof config === 'string'
    ? { dbFileName: config }
    : config

  const {
    dbFileName,
    walMode = true,
    busyTimeout = 5000,
    strictMode = true,
    cacheSize = -64000,
  } = dbConfig

  // Create database connection
  const sqlite = new Database(dbFileName, {
    create: true,
    readwrite: true,
  })

  // Configure SQLite for better performance and concurrency
  if (walMode) {
    // Enable WAL mode for better concurrent read/write access
    sqlite.run('PRAGMA journal_mode = WAL')
  }

  // Set busy timeout to handle lock contention
  sqlite.run(`PRAGMA busy_timeout = ${busyTimeout}`)

  // Enable foreign key constraints
  sqlite.run('PRAGMA foreign_keys = ON')

  if (strictMode) {
    // Enable strict mode for better type checking
    sqlite.run('PRAGMA strict = ON')
  }

  // Performance optimizations
  sqlite.run('PRAGMA synchronous = NORMAL') // WAL mode allows NORMAL instead of FULL
  sqlite.run(`PRAGMA cache_size = ${cacheSize}`) // Configurable cache size
  sqlite.run('PRAGMA temp_store = MEMORY') // Store temp tables in memory

  const db = drizzle({ client: sqlite })
  return db
}
