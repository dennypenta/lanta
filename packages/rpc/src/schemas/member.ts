import { Type } from 'typebox'

// Project member roles
export const memberRoleSchema = Type.Union([
  Type.Literal('admin'),
  Type.Literal('member'),
  Type.Literal('viewer'),
])

// Base project member schema
export const projectMemberSchema = Type.Object({
  id: Type.String(),
  projectId: Type.String(),
  userId: Type.String(),
  role: memberRoleSchema,
  joinedAt: Type.String({ format: 'date-time' }),
})

// Schema for adding a member to a project
export const addProjectMemberSchema = Type.Object({
  userId: Type.String(),
  role: Type.Optional(memberRoleSchema),
})

// Export inferred types
export type ProjectMember = Type.Static<typeof projectMemberSchema>
export type AddProjectMember = Type.Static<typeof addProjectMemberSchema>
export type MemberRole = Type.Static<typeof memberRoleSchema>
