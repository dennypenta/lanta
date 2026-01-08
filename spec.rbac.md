# Role-Based Access Control (RBAC) Specification

## Overview

This document specifies the Role-Based Access Control system for the Lanta task management application.

## Design Principles

1. **Project-Scoped Permissions**: All permissions are scoped to individual projects
2. **Predefined Permission Set**: System defines all available permissions; projects configure role-to-permission mappings
3. **Flexible Configuration**: Each project can customize which roles receive which permissions via a permission matrix
4. **Admin Immutability**: Admin role always has all permissions and cannot be modified
5. **Type Safety**: All permissions are type-checked at compile time
6. **Defense in Depth**: Permission validation at both middleware and handler levels
7. **Server-Only Permission Logic**: Client never computes or validates permissions - all permission data flows from server through API endpoints
8. **No Client-Side Defaults**: `DEFAULT_ROLE_PERMISSIONS` exists only on the server for seeding new projects; client displays only what the server provides

## Architecture: Client-Server Boundary

### Server Responsibilities
- **Permission Computation**: Determine user's permissions based on role and project configuration
- **Permission Enforcement**: Validate permissions in middleware and API handlers
- **Permission Storage**: Manage `DEFAULT_ROLE_PERMISSIONS` for seeding new projects
- **Permission Delivery**: Provide permission sets to client via API endpoints

### Client Responsibilities
- **Permission Display**: Show/hide UI elements based on permissions received from server
- **No Validation**: Never compute or validate permissions locally
- **No Defaults**: Never reference `DEFAULT_ROLE_PERMISSIONS` or role-based permission logic

### Data Flow
```
Database → getUserPermissions() → API Response → Frontend State → PermissionGate → UI
```

**Key Principle**: The client is a **dumb display layer** for permissions. It only shows what the server tells it to show.

## Permission Model

### Permission Namespace

Permissions use a `resource:action` naming convention:

```
<resource>:<action>
```

Examples:
- `projects:read`
- `projects:write`
- `tasks:write`

### Available Permissions

#### Projects
- `projects:read` - View project details and settings
- `projects:write` - Edit project name and description
- `members:write` - Add/remove members, change member roles

#### Tasks
- `tasks:read` - View tasks
- `tasks:write` - Create and edit tasks

## Role Model

### Built-in Roles

#### Admin (Special Role)
- **Permissions**: ALL permissions (automatically)
- **Granted**: Automatically to project creator
- **Modification**: Cannot modify permissions; always has everything
- **Management**: Admins can promote other users to admin or demote admins
- **Guaranteed**: Every project must have at least one admin

#### Member
- **Permissions** (default):
  - `projects:read`
  - `tasks:read`
  - `tasks:write`
- **Purpose**: Standard project contributor with read-write access to content
- **Modification**: Permissions can be customized per project

#### Viewer
- **Permissions** (default):
  - `projects:read`
  - `tasks:read`
- **Purpose**: Read-only access to project
- **Modification**: Permissions can be customized per project

### Custom Roles (Future)

Projects will be able to create custom roles with custom permission sets.

## Database Schema

### project_role_permissions Table

Stores the permission matrix for each project.

```sql
CREATE TABLE project_role_permissions (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  role VARCHAR(24) NOT NULL,
  permission VARCHAR(48) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE (project_id, role, permission),
  INDEX idx_project_role (project_id, role)
);
```

**Key Design Decisions**:
- Each row represents one permission granted to one role in one project
- `role` stored as string (not FK) to support future custom roles
- UNIQUE constraint prevents duplicate grants
- Composite index for efficient permission lookups
- CASCADE delete removes permissions when project is deleted

## API Handler Permission Declaration

### Route-to-Permission Mapping

API handlers declare required permissions via a centralized configuration:

**File**: `backend/rbac/route-permissions.ts`

```typescript
const ROUTE_PERMISSION_RULES = [
  {
    pattern: /^\/api\/projects\/[^\/]+$/,
    method: ['PUT', 'DELETE'],
    permissions: ['projects:write'],
  },
  {
    pattern: /^\/api\/projects\/[^\/]+\/members$/,
    methods: ['POST'],
    permissions: ['members:write'],
  },
];
```

**Important Notes:**
- Routes WITHOUT a project ID (e.g., `/api/projects`) have NO permission requirements
- These routes can't enforce project-scoped permissions since there's no project context
- Only routes with a project ID parameter can require permissions

### Multiple Required Permissions

Some endpoints may require multiple permissions (all must be satisfied):

```typescript
{
  pattern: /^\/api\/projects\/[^\/]+\/export$/,
  method: 'POST',
  permissions: ['projects:read', 'tasks:read'],
}
```

User must have ALL listed permissions to access the endpoint.

## Permission Validation Flow

### Middleware Pipeline

```
1. authenticateUser        → Authenticate user (JWT/session)
2. enforcePermissions      → Validate permissions (NEW)
3. logRequests             → Log request
4. addSecurityHeaders      → Add security headers
5. addCorsHeaders          → Add CORS headers
```

### Permission Enforcement Algorithm

**File**: `backend/rbac/enforce-permissions.ts`

```typescript
export async function enforcePermissions(req: Request, next: NextFunction) {
  // 1. Check if route requires permissions
  const requiredPerms = getRequiredPermissions(req.method, req.url);
  if (!requiredPerms) return next();

  // 2. Extract project ID from URL
  const projectId = extractProjectId(req.url);
  if (!projectId) return next();

  // 3. Get user's permissions for this project
  const { role, permissions } = await getUserPermissions(projectId, req.user.id);

  // 4. Check if user is a project member
  if (permissions.size === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 }); // Security: hide existence
  }

  // 5. Validate user has all required permissions
  const authorized = requiredPerms.every(perm => permissions.has(perm));
  if (!authorized) {
    logger.info('Permission denied', { userId: req.user.id, projectId, role, required: requiredPerms });
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 6. Attach permission context to request for handlers
  req.projectContext = { projectId, role, permissions };

  return next();
}
```

**Note**: The exact middleware signature depends on your chosen backend framework.

### Permission Lookup

**File**: `backend/rbac/permission-checker.ts`

```typescript
export async function getUserPermissions(
  projectId: string,
  userId: string
): Promise<{ role: string; permissions: Set<Permission> }> {
  // 1. Get user's role from project_members
  const member = await db('project_members')
    .where({ project_id: projectId, user_id: userId })
    .first();

  if (!member) {
    return { role: 'none', permissions: new Set() };
  }

  // 2. Admin role gets all permissions (fast path, no DB query)
  if (member.role === 'admin') {
    return { role: 'admin', permissions: new Set(ALL_PERMISSIONS) };
  }

  // 3. Query permissions from project_role_permissions
  const permRows = await db('project_role_permissions')
    .where({ project_id: projectId, role: member.role })
    .select('permission');

  const permissions = new Set(permRows.map(r => r.permission));

  return { role: member.role, permissions };
}
```

### HTTP Status Codes

- **401 Unauthorized**: User is not authenticated
- **403 Forbidden**: User is authenticated and a project member, but lacks required permissions
- **404 Not Found**: User is not a member of the project (security: don't reveal project existence)

## UI Permission Checks

### Design Principle

**NO client-side permission logic or hardcoded permission lists.**

All permission data flows from the server through API endpoints. The client never computes or checks permissions - it only displays UI based on the permissions list provided by the server.

### Permission Gate Component

**File**: `frontend/components/PermissionGate.svelte`

```svelte
<script lang="ts">
  import type { Permission } from '../types/permissions';

  interface Props {
    permissions: Set<Permission>; // User's actual permissions from server
    requires: Permission;          // Single required permission
    children: any;
  }

  let { permissions, requires, children }: Props = $props();

  const hasAccess = $derived(permissions.has(requires));
</script>

{#if hasAccess}
  {@render children()}
{/if}
```

**Key design:**
- Takes `permissions` (user's actual permissions from server) instead of `role`
- Checks against the actual permissions set, not computed from role
- Requires a single permission (not an array)
- No client-side logic to determine what permissions a role should have

### Fetching Permissions from API

**API Endpoint**: `GET /api/projects/:id/permissions/me`

**Response**:
```json
{
  "projectId": "proj_123",
  "role": "member",
  "permissions": ["projects:read", "tasks:read", "tasks:write"]
}
```

**Frontend Integration Example**:

```svelte
<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import PermissionGate from '../components/PermissionGate.svelte';

  let permissions = $state(new Set<Permission>());
  let project = $state(null);

  // Fetch permissions when component mounts
  onMount(async () => {
    const response = await fetch(`/api/projects/${projectId}/permissions/me`);
    const data = await response.json();
    permissions = new Set(data.permissions);
  });

  // Make permissions available to child components
  setContext('permissions', permissions);
</script>

<div>
  <h3>{project?.name}</h3>

  <PermissionGate permissions={permissions} requires="projects:write">
    <button>Edit Project</button>
  </PermissionGate>

  <PermissionGate permissions={permissions} requires="tasks:write">
    <button>Create Task</button>
  </PermissionGate>

  <PermissionGate permissions={permissions} requires="members:write">
    <button>Manage Members</button>
  </PermissionGate>
</div>
```

**Benefits of this approach:**
- Single source of truth (server determines permissions)
- No client-side permission logic to keep in sync
- Works correctly even if permission matrix is customized per project
- Permissions fetched fresh when needed
- Type-safe with TypeScript

## Settings UI - Permission Matrix Editor

### Page Route

Frontend route that displays the permission matrix editor

### UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Role & Permission Settings                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Permission Matrix:                                          │
│                                                             │
│ ┌────────────────────┬────────┬────────┬────────┐          │
│ │ Permission         │ Admin  │ Member │ Viewer │          │
│ ├────────────────────┼────────┼────────┼────────┤          │
│ │ Projects                                      │          │
│ ├────────────────────┼────────┼────────┼────────┤          │
│ │ View Project       │ [x]    │ [x]    │ [x]    │          │
│ │ Edit Project       │ [x]    │ [ ]    │ [ ]    │          │
│ │ Delete Project     │ [x]    │ [ ]    │ [ ]    │          │
│ │ Manage Members     │ [x]    │ [ ]    │ [ ]    │          │
│ │ Manage Settings    │ [x]    │ [ ]    │ [ ]    │          │
│ ├────────────────────┼────────┼────────┼────────┤          │
│ │ Tasks                                         │          │
│ ├────────────────────┼────────┼────────┼────────┤          │
│ │ View Tasks         │ [x]    │ [x]    │ [x]    │          │
│ │ Create/Edit Tasks  │ [x]    │ [x]    │ [ ]    │          │
│ │ Delete Tasks       │ [x]    │ [ ]    │ [ ]    │          │
│ └────────────────────┴────────┴────────┴────────┘          │
│                                                             │
│ Note: Admin checkboxes are disabled (always has all perms) │
└─────────────────────────────────────────────────────────────┘
```

### API Endpoints

#### GET /api/projects/:id/permissions

**Required Permission**: `projects:write`

**Response**:
```json
{
  "matrix": {
    "admin": [
      "projects:read",
      "projects:write",
      "tasks:read",
      "tasks:write"
    ],
    "member": [
      "projects:read",
      "tasks:read",
      "tasks:write"
    ],
    "viewer": [
      "tasks:read"
    ]
  }
}
```

#### PUT /api/projects/:id/permissions

**Required Permission**: `projects:write`

**Request Body**:
```json
{
  "role": "member",
  "permissions": [
    "projects:read",
    "tasks:read",
    "tasks:write"
  ]
}
```

**Validation Rules**:
- Cannot modify `admin` role
- Role must exist in the project
- Permissions must be valid (from predefined set)
- Changes take effect immediately

### Implementation Details

**Frontend Component**: `frontend/pages/ProjectSettings.svelte`

- Fetches permission matrix from `GET /api/projects/:id/permissions` on component mount
- Renders checkboxes grouped by category
- Admin checkboxes are disabled (read-only)
- Updates are sent to `PUT /api/projects/:id/permissions` on checkbox change
- Optimistic UI updates with error rollback

## Project Creation Flow

When a new project is created:

1. **Create project record** in `projects` table
2. **Add creator as admin** in `project_members` table with `role = 'admin'`
3. **Seed default permissions** in `project_role_permissions` table for all three roles

**File**: `backend/rbac/default-permissions.ts`

```typescript
/**
 * DEFAULT_ROLE_PERMISSIONS
 *
 * IMPORTANT: This is SERVER-ONLY configuration.
 * Used ONLY during project creation to seed initial role permissions.
 *
 * The client NEVER imports or uses this - all permission data flows from
 * the database through API endpoints.
 */
export const DEFAULT_ROLE_PERMISSIONS = {
  admin: ['projects:read', 'projects:write', 'members:write', 'tasks:read', 'tasks:write'],
  member: ['projects:read', 'tasks:read', 'tasks:write'],
  viewer: ['projects:read', 'tasks:read'],
} as const;
```

**File**: `backend/db/queries.ts`

```typescript
import { DEFAULT_ROLE_PERMISSIONS } from '../rbac/default-permissions';
import { randomUUID } from 'crypto';

export async function createProject(userId: string, input: CreateProjectInput) {
  const projectId = randomUUID();

  await db.transaction(async (trx) => {
    // 1. Create project
    await trx('projects').insert({ id: projectId, ... });

    // 2. Add creator as admin
    await trx('project_members').insert({
      project_id: projectId,
      user_id: userId,
      role: 'admin',
    });

    // 3. Seed default permissions for all roles
    const permissionInserts = [];
    for (const [role, permissions] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
      for (const permission of permissions) {
        permissionInserts.push({
          id: randomUUID(),
          project_id: projectId,
          role,
          permission,
        });
      }
    }
    await trx('project_role_permissions').insert(permissionInserts);
  });

  return project;
}
```

**Key Points:**
- `DEFAULT_ROLE_PERMISSIONS` is **server-only**
- Used **only once** when creating a new project
- After creation, permissions are managed via the database and permission matrix UI
- Client never sees or uses this constant

## Security Considerations

### 1. Admin Role Protection
- Admin permissions are immutable
- API rejects attempts to modify admin permissions
- UI shows admin checkboxes as disabled

### 2. Information Disclosure Prevention
- Return **404** (not 403) when user is not a project member
- Prevents revealing project existence to unauthorized users

### 3. Defense in Depth
- Permission checks in middleware (enforces for all routes)
- Permission checks in handlers (explicit verification)
- Permission checks in UI (prevents unauthorized actions from being displayed)

### 4. Audit Logging
- Log all permission denials with context:
  - User ID
  - Project ID
  - Current role
  - Required permissions
  - Requested endpoint

### 5. Type Safety
- All permissions are compile-time checked
- TypeScript prevents typos in permission names
- Route configuration validated at build time

### 6. SQL Injection Prevention
- All queries use Knex query builder (parameterized)
- No raw SQL with user input

## Performance Considerations

### 1. Permission Caching
- **Scope**: Per-request only (middleware attaches to request context)
- **Invalidation**: Automatic (new request = new cache)
- **Admin Fast Path**: Bypass DB query for admin role

### 2. Database Indexes
- Composite index on `(project_id, role)` for fast lookups
- Unique index on `(project_id, role, permission)` prevents duplicates

### 3. Query Optimization
- Single query to fetch all permissions for a role
- Batch inserts when seeding permissions (100 rows per batch)
- Join `project_members` + `project_role_permissions` where possible

### 4. UI Performance
- Permission data loaded once per project view via API call
- Permissions stored in frontend state management for efficient access by all child components
- No client-side computation or permission lookups
- Settings page fetches matrix once on load
- Optimistic updates for better UX

## Future Enhancements

### Phase 2: Custom Roles
- Allow projects to create custom roles beyond the three defaults
- UI for creating and naming custom roles
- Assign permissions to custom roles via the matrix

## Testing Requirements

### Unit Tests
- Permission validation logic
- Route pattern matching
- Permission checker utility functions

### Integration Tests
- API endpoints with different roles
- Verify correct status codes (401, 403, 404)
- Permission matrix CRUD operations

### E2E Tests
- Create project and verify creator is admin
- Navigate to settings and modify permissions
- Verify UI actions show/hide based on role
- Attempt unauthorized action and verify rejection

## Appendix: Complete Permission List

```typescript
// Projects
'projects:read'            // View project details
'projects:write'           // Edit project name/description/settings

// Members
'members:read'            // View comments
'members:write'           // Create and edit comments

// Tasks
'tasks:read'               // View tasks
'tasks:write'              // Create and edit tasks
```

