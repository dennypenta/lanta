// Re-export types from schemas
export type { AuthEnterResponse, SignInInput, SignUpInput, UserProfile } from '../schemas/auth'
export type { CreateProject, Project, UpdateProject } from '../schemas/project'

export type { AddProjectMember, MemberRole, ProjectMember } from '../schemas/member'

export type Error = {
  code: string
  message?: string
  meta: Record<string, string>
}

// Additional shared types can be added here
export type ApiResponse<T> =
  | {
      data: T
      error?: never
    }
  | {
      data?: never
      error: Error
    }
