import { t } from 'elysia'

export const projectSchema = t.Object({
  id: t.String(),
  name: t.String({ minLength: 1, maxLength: 255, description: 'Project name is required' }),
  description: t.Union([t.String({ maxLength: 1000 }), t.Null()]),
  createdAt: t.String({ format: 'date-time' }),
  updatedAt: t.String({ format: 'date-time' }),
})

export const createProjectSchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 255, description: 'Project name is required' }),
  description: t.Union([t.String({ maxLength: 1000 }), t.Null()]),
})

export const updateProjectSchema = t.Partial(createProjectSchema)

export type Project = typeof projectSchema.static
export type CreateProject = typeof createProjectSchema.static
export type UpdateProject = typeof updateProjectSchema.static
