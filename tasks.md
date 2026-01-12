# Lanta - Task Manager Implementation Plan

## Project Overview

Multi-tenant kanban board (Trello/Linear-like).

**Tech Stack:**

- Frontend: solid
- Components: ark ui
- Styling: tailwind
- Router: solid router
- Backend: Bun API (Bun serve + orpc)
- Validation: Zod
- Database: SQLite (with drizzle orm)
- Identity: better_auth

---

## Phase 1: Foundation & Infrastructure

### 1.1 Development Environment Setup

- [x] Setup Bun backend project structure
- [x] Setup solid frontend project structure
- [x] Configure development servers with hot reload
- [x] Setup project file organization (backend/, frontend/)

**Dependencies:** None

### 1.2 Database Layer

- [x] Setup drizzle
- [x] Create database schema (see Phase 2 for details)
- [x] Setup migration system
- [x] Configure SQLite connection pool

**Dependencies:** 1.1

### 1.3 API Infrastructure

- [x] Setup HTTP server with Bun
- [x] Configure API routing structure
- [x] Setup oRPC transport to prepare for middlewares, move the existing fetch function to a designated cors middleware
- [x] Setup structured logging middleware
- [x] Configure CORS and security headers
- [x] Implement GET /health endpoint (responds with 200 OK)

**Dependencies:** 1.1, 1.2

### 1.4 UI Foundation

- [x] setup UI component library ark ui
- [x] Configure Tailwind CSS for solid
- [x] Create base layout  Sidebar
- [x] Create base layout  Header
- [x] Setup responsive design breakpoints
- [x] Extract a sidebar menu component from a sidebar

**Dependencies:** 1.1

---

## Phase 2: Core Data Models & Authentication

### 2.1 Database Schema Design

```
Tables:
- projects (id, tenant_id, name, description, created_at, updated_at)
- project_members (id, project_id, user_id, role, created_at, updated_at)
- tasks (id, column_id, project_id, title, description, assignee_id, position, created_at, updated_at)
```

- [x] Create migration for all the table
- [x] Add indexes for performance (project_id, etc.)

**Dependencies:** 1.2

### 2.2 Authentication System

- [ ] Setup session management (cookies) using better_auth
- [ ] Implement POST /api/auth/signup endpoint
- [ ] Implement POST /api/auth/signin endpoint
- [ ] Implement POST /api/auth/signout endpoint
- [ ] Create auth middleware for protected API routes
- [ ] Implement token refresh mechanism
- [ ] Setup email verification (optional)
- [ ] Create frontend sign in/sign up forms

**Dependencies:** 2.1, 1.3

### 2.3 User Whitelist System

- [ ] Create API endpoint: POST /api/tenants/:tenantId/whitelist (add email)
- [ ] Create API endpoint: DELETE /api/tenants/:tenantId/whitelist/:id (remove email)
- [ ] Create API endpoint: GET /api/tenants/:tenantId/whitelist (list whitelisted emails)
- [ ] Add validation: only allow whitelisted emails to sign up/sign in
- [ ] Create UI for managing whitelist (admin only)
- [ ] Add invite email notification (optional)

**Dependencies:** 2.1, 2.2

---

## Phase 3: RBAC (Role-Based Access Control)

### 3.1 Permission System Design

```
Roles:
- tenant_owner: full access to tenant
- tenant_admin: manage projects, users, settings
- project_admin: manage project settings, columns, members
- project_member: create/edit/delete tasks
- project_viewer: read-only access

Permissions:
- tenant:manage_settings
- tenant:manage_users
- tenant:manage_whitelist
- project:create
- project:delete
- project:manage_settings
- project:manage_columns
- project:manage_members
- task:create
- task:edit
- task:delete
```

- [ ] Create role definitions and seeding in backend
- [ ] Implement permission checking utility functions
- [ ] Create RBAC middleware for API routes
- [ ] Add permission checks to all protected API endpoints
- [ ] Create frontend components for role display
- [ ] Create permission gate component for conditional UI rendering

**Dependencies:** 2.1

### 3.2 Tenant & Project Membership

- [ ] Create API endpoint: POST /api/tenants/:tenantId/members (add user to tenant)
- [ ] Create API endpoint: PATCH /api/tenants/:tenantId/members/:userId (update role)
- [ ] Create API endpoint: DELETE /api/tenants/:tenantId/members/:userId (remove user)
- [ ] Create API endpoint: POST /api/projects/:projectId/members (add user to project)
- [ ] Create API endpoint: PATCH /api/projects/:projectId/members/:userId (update role)
- [ ] Create API endpoint: DELETE /api/projects/:projectId/members/:userId (remove user)
- [ ] Add validation: ensure user has permission to manage members

**Dependencies:** 3.1, 2.1

---

## Phase 4: Multi-Tenancy & Projects

### 4.1 Tenant Management

- [ ] Create API endpoint: POST /api/tenants (create tenant)
- [ ] Create API endpoint: GET /api/tenants (list user's tenants)
- [ ] Create API endpoint: GET /api/tenants/:tenantId (get tenant details)
- [ ] Create API endpoint: PATCH /api/tenants/:tenantId (update tenant)
- [ ] Create API endpoint: DELETE /api/tenants/:tenantId (delete tenant)
- [ ] Add tenant context middleware (extract from subdomain or path)
- [ ] Create frontend tenant switcher UI component
- [ ] Create frontend tenant settings page (admin only)
- [ ] Implement API client functions for tenant operations

**Dependencies:** 2.1, 2.2, 3.1

### 4.2 Project Management

- [ ] Create API endpoint: POST /api/tenants/:tenantId/projects (create project)
- [ ] Create API endpoint: GET /api/tenants/:tenantId/projects (list projects)
- [ ] Create API endpoint: GET /api/projects/:projectId (get project details)
- [ ] Create API endpoint: PATCH /api/projects/:projectId (update project)
- [ ] Create API endpoint: DELETE /api/projects/:projectId (delete project)
- [ ] Create frontend projects list component
- [ ] Create frontend project creation form
- [ ] Create frontend project settings page
- [ ] Implement API client functions for project operations
- [ ] Add permission checks in backend (only admins can create/delete projects)
- [ ] Add permission gates in frontend UI

**Dependencies:** 4.1, 3.1

---

## Phase 5: Kanban Board Core

### 5.1 Column Management

- [ ] Create API endpoint: POST /api/projects/:projectId/columns (create column)
- [ ] Create API endpoint: GET /api/projects/:projectId/columns (list columns)
- [ ] Create API endpoint: PATCH /api/columns/:columnId (update column name)
- [ ] Create API endpoint: PATCH /api/columns/:columnId/position (reorder column)
- [ ] Create API endpoint: DELETE /api/columns/:columnId (delete column)
- [ ] Add validation: prevent deleting column with tasks (or cascade)
- [ ] Create column management UI
- [ ] Implement drag-and-drop for column reordering
- [ ] Add permission checks (only project admins can manage columns)

**Dependencies:** 4.2, 3.1

### 5.2 Task Management

- [ ] Create API endpoint: POST /api/projects/:projectId/tasks (create task)
- [ ] Create API endpoint: GET /api/projects/:projectId/tasks (list tasks)
- [ ] Create API endpoint: GET /api/tasks/:taskId (get task details)
- [ ] Create API endpoint: PATCH /api/tasks/:taskId (update task)
- [ ] Create API endpoint: PATCH /api/tasks/:taskId/move (move task to different column)
- [ ] Create API endpoint: PATCH /api/tasks/:taskId/position (reorder task in column)
- [ ] Create API endpoint: DELETE /api/tasks/:taskId (delete task)
- [ ] Create frontend kanban board UI layout
- [ ] Create frontend task card component
- [ ] Implement drag-and-drop for task movement (frontend)
- [ ] Create frontend task detail modal/page
- [ ] Create frontend task creation form
- [ ] Implement API client functions for task operations
- [ ] Add real-time updates (optional: WebSocket or polling)
- [ ] Add permission checks in backend based on user role
- [ ] Add permission gates in frontend UI

**Dependencies:** 5.1, 3.1

---

## Phase 6: Background Worker & Backups

### 6.1 Background Worker Infrastructure

- [ ] Create worker process/thread in Bun
- [ ] Setup job queue system (in-memory or SQLite-based)
- [ ] Create worker scheduler (cron-like)
- [ ] Implement worker health check
- [ ] Add worker logging and error handling

**Dependencies:** 1.2, 1.3

### 6.2 Database Backup System

- [ ] Create backup job scheduler (daily/weekly configurable)
- [ ] Implement SQLite database snapshot creation
- [ ] Create backup destination abstraction layer
- [ ] Implement email backup destination (with attachment)
- [ ] Implement S3 backup destination (AWS SDK)
- [ ] Implement Slack backup destination (webhook)
- [ ] Create API endpoint: POST /api/tenants/:tenantId/backups (trigger manual backup)
- [ ] Create API endpoint: GET /api/tenants/:tenantId/backups (list backup history)
- [ ] Create frontend backup settings UI (admin only)
- [ ] Implement API client functions for backup operations
- [ ] Add backup status notifications (frontend)

**Dependencies:** 6.1, 4.1

---

## Phase 7: Polish & Production Readiness

### 7.1 Testing

- [ ] Write unit tests for business logic
- [ ] Write integration tests for API endpoints
- [ ] Write E2E tests for critical user flows
- [ ] Test multi-tenancy isolation
- [ ] Test permission system thoroughly
- [ ] Load testing for concurrent users

**Dependencies:** All previous phases

### 7.2 Documentation & Deployment

- [ ] Complete OpenAPI specification
- [ ] Write API documentation
- [ ] Create user guide
- [ ] Create admin guide
- [ ] Setup production environment
- [ ] Configure database backups
- [ ] Setup monitoring and logging
- [ ] Configure deployment pipeline

**Dependencies:** 7.1

---

## Phase 8: AI native

### Render project as a markdown

- [ ] Implement API to render the board as a md file
- [ ] Add a button to a board "Copy as .md" to copy the content to clipboard

---

## Recommended Implementation Order

1. Phase 1 (Foundation) + Phase 2.1 (Database Schema)
2. Phase 2.2-2.3 (Authentication & Whitelist) + Phase 3 (RBAC)
3. Phase 4 (Tenants & Projects)
4. Phase 5 (Kanban Board Core)
5. Phase 6 (Background Worker & Backups)
6. Phase 7 (Polish & Production)

---

## Critical Dependencies Summary

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7
         (auth)    (rbac)    (tenants)  (kanban)  (backups) (polish)
```

**Key Decision Points:**

1. **Backend framework:** Choose between Hono, Elysia, Express, or other Bun-compatible framework
2. **UI component library:** shadcn-solid or alternative for solid
3. **Authentication library:** better-auth, custom JWT, or other
4. **Backup destination:** Choose between email/S3/Slack (or support all three)
5. **Real-time updates:** WebSocket vs polling vs SSE
6. **Session management:** Cookies vs JWT
7. **Multi-tenancy approach:** Subdomain vs path-based routing
8. **Task assignments:** Single assignee vs multiple assignees
9. **Email verification:** Required vs optional for sign up
