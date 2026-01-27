import { t } from 'elysia'

export const memberRoleSchema = t.Union([t.Literal('admin'), t.Literal('member'), t.Literal('viewer')])

export const projectMemberSchema = t.Object({
  id: t.String(),
  projectId: t.String(),
  userId: t.String(),
  role: memberRoleSchema,
  joinedAt: t.String({ format: 'date-time' }),
})

export const addProjectMemberSchema = t.Object({
  userId: t.String(),
  role: t.Optional(memberRoleSchema),
})

export type ProjectMember = typeof projectMemberSchema.static
export type AddProjectMember = typeof addProjectMemberSchema.static
export type MemberRole = typeof memberRoleSchema.static
