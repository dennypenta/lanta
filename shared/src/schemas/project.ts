import { z } from 'zod'

// Base project schema matching database structure
export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required').max(255),
  description: z.string().max(1000).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Schema for creating a new project (no id, timestamps)
export const createProjectSchema = projectSchema.pick({
  name: true,
  description: true,
})

// Schema for updating a project
export const updateProjectSchema = createProjectSchema.partial()

// Export inferred types
export type Project = z.infer<typeof projectSchema>
export type CreateProject = z.infer<typeof createProjectSchema>
export type UpdateProject = z.infer<typeof updateProjectSchema>
