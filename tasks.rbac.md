# RBAC Implementation Tasks

This document provides a step-by-step implementation plan for the Role-Based Access Control (RBAC) system as specified in `rbac.md`.

## Phase 1: Database Schema & Core Types

### Task 1.1: Create project_role_permissions Table Migration

- [ ] Create migration file: `bun run db:migrate:make create_project_role_permissions`
- [ ] Add table schema with columns:
  - `id` VARCHAR(36) PRIMARY KEY
  - `project_id` VARCHAR(36) NOT NULL (FK to projects)
  - `role` VARCHAR(24) NOT NULL
  - `permission` VARCHAR(48) NOT NULL
  - `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
- [ ] Add UNIQUE constraint on `(project_id, role, permission)`
- [ ] Add composite index `idx_project_role` on `(project_id, role)`
- [ ] Add CASCADE delete on project_id foreign key
- [ ] Run migration: `bun run db:migrate`
- [ ] Verify table creation in SQLite database

### Task 1.2: Define Permission Types

- [ ] Create file: `backend/rbac/permissions.ts`
- [ ] Define `Permission` type with all permissions:
  - `projects:read`
  - `projects:write`
  - `members:write`
  - `tasks:read`
  - `tasks:write`
- [ ] Export `ALL_PERMISSIONS` constant as array of all permissions
- [ ] Export `Role` type: `'admin' | 'member' | 'viewer'`

### Task 1.3: Create Default Permissions Configuration (Server-Only)

- [ ] Create file: `backend/rbac/default-permissions.ts`
- [ ] Define `DEFAULT_ROLE_PERMISSIONS` constant with mappings:
  - `admin`: all permissions
  - `member`: `['projects:read', 'tasks:read', 'tasks:write']`
  - `viewer`: `['projects:read', 'tasks:read']`
- [ ] Export as `const` with type assertion

## Phase 2: Permission Checking Utilities

### Task 2.1: Implement getUserPermissions Function

- [ ] Create file: `backend/rbac/permission-checker.ts`
- [ ] Implement `getUserPermissions(projectId: string, userId: string)`:
  - Query `project_members` for user's role
  - Return `{ role: 'none', permissions: new Set() }` if not a member
  - Fast path: if role is 'admin', return all permissions without DB query
  - Otherwise, query `project_role_permissions` for role's permissions
  - Return `{ role: string, permissions: Set<Permission> }`
- [ ] Add error handling for database errors

### Task 2.2: Create Route Permission Rules

- [ ] Create file: `backend/rbac/route-permissions.ts`
- [ ] Define `RoutePermissionRule` interface with:
  - `pattern: RegExp`
  - `methods: string[]`
  - `permissions: Permission[]`
- [ ] Create `ROUTE_PERMISSION_RULES` array with initial rules:
  - PUT/DELETE `/api/projects/:id` requires `['projects:write']`
  - POST `/api/projects/:id/members` requires `['members:write']`
  - GET/POST/PUT/DELETE `/api/projects/:id/tasks/*` requires `['tasks:read']` or `['tasks:write']`
- [ ] Implement `getRequiredPermissions(method: string, pathname: string): Permission[] | null`
- [ ] Implement `extractProjectId(pathname: string): string | null` helper
- [ ] Add unit tests for route matching logic

## Phase 3: Middleware Implementation

### Task 3.1: Define Request Context Types

- [ ] Create type definitions for request context
- [ ] Add `projectContext` to request type:
  ```typescript
  projectContext?: {
    projectId: string;
    role: string;
    permissions: Set<Permission>;
  }
  ```
- [ ] Ensure type safety across the application

### Task 3.2: Implement Permission Enforcement Middleware

- [ ] Create file: `backend/rbac/enforce-permissions.ts`
- [ ] Import required utilities (getUserPermissions, route-permissions, logger)
- [ ] Implement `enforcePermissions` middleware function:
  - Check if route requires permissions
  - Extract projectId from URL
  - Get user's permissions using `getUserPermissions()`
  - Return 404 if user is not a project member (security: hide existence)
  - Check if user has ALL required permissions
  - Return 403 if unauthorized, with logging
  - Attach `projectContext` to request context if authorized
  - Continue to next middleware
- [ ] Add comprehensive logging for permission denials
- [ ] Export middleware function

### Task 3.3: Integrate Middleware into Pipeline

- [ ] Add `enforcePermissions` middleware to the API server
- [ ] Ensure middleware runs in correct order:
  - Authentication middleware
  - Permission enforcement
  - Logging
  - Security headers
  - CORS headers
- [ ] Test that middleware pipeline functions correctly

## Phase 4: Project Creation with RBAC Seeding

### Task 4.1: Update createProject Function

- [ ] Edit `backend/db/queries.ts` (or create if doesn't exist)
- [ ] Import `DEFAULT_ROLE_PERMISSIONS` from `backend/rbac/default-permissions`
- [ ] Update `createProject()` function to use transaction:
  - Create project record
  - Add creator as admin in `project_members`
  - Seed permissions: loop through `DEFAULT_ROLE_PERMISSIONS` and insert into `project_role_permissions`
  - Use batch insert for efficiency (100 rows per batch)
- [ ] Add error handling and transaction rollback
- [ ] Return created project with ID

### Task 4.2: Test Project Creation Flow

- [ ] Create E2E test: `tests/e2e/rbac/project-creation.spec.ts`
- [ ] Test that new project:
  - Creates project record
  - Adds creator as admin
  - Seeds all default permissions for all three roles
- [ ] Verify admin has all permissions
- [ ] Verify member and viewer have correct default permissions

## Phase 5: API Endpoints for Permission Management

### Task 5.1: GET /api/projects/:id/permissions Endpoint

- [ ] Create API route handler for `GET /api/projects/:id/permissions`
- [ ] Implement handler:
  - Verify user has `projects:write` permission (via projectContext)
  - Query all permissions grouped by role from `project_role_permissions`
  - Transform to matrix format: `{ [role]: Permission[] }`
  - Return JSON response
- [ ] Add error handling for missing project

### Task 5.2: PUT /api/projects/:id/permissions Endpoint

- [ ] Create API route handler for `PUT /api/projects/:id/permissions`
- [ ] Implement handler:
  - Validate request body (role and permissions array)
  - Reject if role is 'admin' (admin is immutable)
  - Verify all permissions are valid (from ALL_PERMISSIONS)
  - Use transaction to:
    - Delete existing permissions for role in this project
    - Insert new permissions
  - Return success response
- [ ] Add validation errors with 400 status
- [ ] Add logging for permission changes

### Task 5.3: GET /api/projects/:id/permissions/me Endpoint

- [ ] Create API route handler for `GET /api/projects/:id/permissions/me`
- [ ] Implement handler:
  - Get current user's permissions for the project
  - Return user's role and permission list
  - Return 404 if user is not a member
- [ ] This endpoint is used by frontend to fetch permissions on page load

### Task 5.4: Test Permission Management APIs

- [ ] Create integration tests for permission management endpoints
- [ ] Test GET /permissions endpoint returns correct permission matrix
- [ ] Test PUT endpoint successfully updates permissions
- [ ] Test PUT endpoint rejects admin role modifications
- [ ] Test PUT endpoint requires `projects:write` permission
- [ ] Test GET /permissions/me returns user's permissions
- [ ] Test 403 response for unauthorized users
- [ ] Test 404 response for non-members

## Phase 6: UI Components

### Task 6.1: Create PermissionGate Component

- [ ] Create file: `frontend/components/PermissionGate.svelte`
- [ ] Define props interface:
  - `permissions: Set<Permission>` (user's actual permissions from server)
  - `requires: Permission` (single required permission)
  - `children: any` (Svelte children snippet)
- [ ] Implement component logic:
  - Check if user has required permission
  - Conditionally render children using `{#if hasAccess}`
- [ ] Add TypeScript types for all props
- [ ] Add JSDoc comments explaining usage

### Task 6.2: Create Permission Fetching Logic

- [ ] Create API client function to fetch user permissions
- [ ] Implement `fetchUserPermissions(projectId: string)`:
  - Call `GET /api/projects/:id/permissions/me`
  - Return permissions as Set<Permission>
  - Handle errors appropriately
- [ ] Add TypeScript types for API response

### Task 6.3: Implement Permission State Management

- [ ] Create state management for permissions in project view
- [ ] Fetch permissions when project view loads
- [ ] Store permissions in component state or global store
- [ ] Make permissions available to child components
- [ ] Handle loading and error states

### Task 6.4: Add PermissionGate to Existing UI

- [ ] Identify components that need permission gates:
  - Project edit buttons (requires `projects:write`)
  - Task create/edit buttons (requires `tasks:write`)
  - Member management buttons (requires `members:write`)
- [ ] Update each component:
  - Import `PermissionGate` component
  - Get permissions from state/context
  - Wrap protected UI elements with `<PermissionGate>`
- [ ] Test UI shows/hides elements correctly for different roles

## Phase 7: Settings Page - Permission Matrix Editor

### Task 7.1: Create Settings Page Component

- [ ] Create file: `frontend/pages/ProjectSettings.svelte`
- [ ] Import necessary components (PermissionGate, Button, etc.)
- [ ] Get permissions from state/context
- [ ] Wrap entire settings page in `<PermissionGate requires="projects:write">`
- [ ] Create basic page structure with title "Role & Permission Settings"

### Task 7.2: Fetch and Display Permission Matrix

- [ ] Fetch permission matrix from `GET /api/projects/:id/permissions` on mount
- [ ] Create UI table structure:
  - Header row with role columns (Admin, Member, Viewer)
  - Group permissions by category (Projects, Tasks, Members)
  - Render checkboxes for each permission-role combination
- [ ] Disable all admin checkboxes (read-only)
- [ ] Add note: "Admin checkboxes are disabled (always has all permissions)"
- [ ] Handle loading and error states

### Task 7.3: Implement Permission Updates

- [ ] Add checkbox change handlers
- [ ] Implement optimistic UI updates
- [ ] Call PUT `/api/projects/:id/permissions` on change
- [ ] Show loading state during API call
- [ ] Rollback on error with error message display
- [ ] Show success feedback after save

### Task 7.4: Add Permission Descriptions

- [ ] Create a mapping of permissions to user-friendly descriptions
- [ ] Display descriptions as tooltips or help text next to each permission
- [ ] Use consistent language:
  - `projects:read` → "View project details and settings"
  - `projects:write` → "Edit project name and description"
  - `members:write` → "Add/remove members, change member roles"
  - `tasks:read` → "View tasks"
  - `tasks:write` → "Create and edit tasks"

## Phase 8: Testing & Validation

### Task 8.1: Unit Tests for Permission Utilities

- [ ] Create `backend/rbac/permission-checker.test.ts`
- [ ] Test `getUserPermissions()`:
  - Returns empty permissions for non-members
  - Returns all permissions for admin
  - Returns correct permissions for member/viewer
  - Handles database errors gracefully
- [ ] Mock database queries appropriately

### Task 8.2: Unit Tests for Route Permissions

- [ ] Create `backend/rbac/route-permissions.test.ts`
- [ ] Test `getRequiredPermissions()`:
  - Returns null for routes without permissions
  - Returns correct permissions for matched routes
  - Handles method matching correctly
- [ ] Test `extractProjectId()`:
  - Extracts ID from valid project URLs
  - Returns null for non-project URLs

### Task 8.3: Integration Tests for Middleware

- [ ] Create integration tests for permission enforcement middleware
- [ ] Test middleware behavior:
  - Allows requests without permission requirements
  - Blocks non-members with 404
  - Blocks unauthorized members with 403
  - Allows authorized requests and attaches projectContext
  - Logs permission denials correctly

### Task 8.4: E2E Tests for Permission Gates

- [ ] Create E2E tests for permission gate functionality
- [ ] Test as admin:
  - All UI elements visible
  - Can perform all actions
- [ ] Test as member:
  - Edit project button hidden
  - Can create/edit tasks
  - Cannot manage members
- [ ] Test as viewer:
  - All edit buttons hidden
  - Can only view content

### Task 8.5: E2E Tests for Settings Page

- [ ] Create E2E tests for permission matrix editor
- [ ] Test as admin:
  - Can access settings page
  - Can view permission matrix
  - Can modify member/viewer permissions
  - Cannot modify admin permissions (checkboxes disabled)
  - Changes persist after page reload
- [ ] Test as non-admin:
  - Cannot access settings page (404 or hidden link)

### Task 8.6: Security Testing

- [ ] Test information disclosure:
  - Non-members receive 404, not 403
  - Project existence not revealed to unauthorized users
- [ ] Test admin protection:
  - API rejects admin permission modifications
  - UI prevents admin checkbox changes
- [ ] Test permission bypass attempts:
  - Direct API calls without permissions fail
  - Client-side permission checks alone are insufficient

---

## Testing Checklist Summary

### Unit Tests

- [ ] Permission checker utilities
- [ ] Route permission matching
- [ ] Project ID extraction

### Integration Tests

- [ ] Middleware pipeline
- [ ] Database queries
- [ ] API endpoints

### E2E Tests

- [ ] Project creation with permission seeding
- [ ] Permission management via settings page
- [ ] UI permission gates for different roles
- [ ] Security (404 for non-members, 403 for unauthorized)

### Manual Testing

- [ ] Test as admin, member, and viewer roles
- [ ] Test permission matrix changes
- [ ] Test concurrent users
- [ ] Test performance with many permissions

---

## Success Criteria

- ✅ All permissions are enforced at middleware level
- ✅ All API endpoints check permissions
- ✅ UI correctly shows/hides elements based on permissions
- ✅ Admin permissions are immutable
- ✅ Non-members receive 404 (not 403)
- ✅ Permission matrix can be customized per project
- ✅ All tests pass
- ✅ No client-side permission logic (all from server)
- ✅ Type-safe permission checks
- ✅ Comprehensive logging for security events

---

## Estimated Implementation Order

1. **Week 1**: Phase 1-2 (Database & Core Utilities)
2. **Week 2**: Phase 3-4 (Middleware & Project Creation)
3. **Week 3**: Phase 5-6 (API & UI Components)
4. **Week 4**: Phase 7-8 (Settings Page & Testing)
5. **Week 5**: Phase 9-11 (Documentation, Optimization, Deployment)

This is a comprehensive implementation plan. Adjust priorities based on project needs.
