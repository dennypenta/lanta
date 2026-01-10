import { index, int, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const projectsTable = sqliteTable('projects', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  createdAt: int('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: int('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const projectMembersTable = sqliteTable(
  'project_members',
  {
    id: int().primaryKey({ autoIncrement: true }),
    projectId: int('project_id')
      .notNull()
      .references(() => projectsTable.id, { onDelete: 'cascade' }),
    userId: int('user_id').notNull(),
    role: text().notNull(),
    createdAt: int('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index('project_members_project_id_idx').on(table.projectId),
    index('project_members_user_id_idx').on(table.userId),
    uniqueIndex('project_members_project_user_unique').on(table.projectId, table.userId),
  ],
)
