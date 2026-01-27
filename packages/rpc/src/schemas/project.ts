import { Type } from 'typebox'

// Base project schema matching database structure
export const projectSchema = Type.Object({
  id: Type.String(),
  name: Type.String({ minLength: 1, maxLength: 255, description: 'Project name is required' }),
  description: Type.Union([Type.String({ maxLength: 1000 }), Type.Null()]),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
})

// Schema for creating a new project (no id, timestamps)
export const createProjectSchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 255, description: 'Project name is required' }),
  description: Type.Union([Type.String({ maxLength: 1000 }), Type.Null()]),
})

// Schema for updating a project
export const updateProjectSchema = Type.Partial(createProjectSchema)

// Export inferred types
export type Project = Type.Static<typeof projectSchema>
export type CreateProject = Type.Static<typeof createProjectSchema>
export type UpdateProject = Type.Static<typeof updateProjectSchema>
