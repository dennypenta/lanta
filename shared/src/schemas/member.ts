import { z } from 'zod'

// Project member roles
export const memberRoleSchema = z.enum(['admin', 'member', 'viewer'])

// Base project member schema
export const projectMemberSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
  role: memberRoleSchema,
  joinedAt: z.date(),
})

// Schema for adding a member to a project
export const addProjectMemberSchema = z.object({
  userId: z.string(),
  role: memberRoleSchema.default('member'),
})

// Export inferred types
export type ProjectMember = z.infer<typeof projectMemberSchema>
export type AddProjectMember = z.infer<typeof addProjectMemberSchema>
export type MemberRole = z.infer<typeof memberRoleSchema>
