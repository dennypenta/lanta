# Lanta

Task management application.

## Tech Stack

- **Runtime**: Bun
- **API Framework**: Elysia
- **Authentication**: Better Auth with Drizzle adapter
- **Database**: Drizzle ORM + SQLite
- **Validation**: Valibot
- **Frontend**: SolidJS + Solid Router
- **UI Components**: Kobalte UI
- **Styling**: Tailwind CSS

## Roadmap

- [x] setup basic api
- [x] add env loading for config
- [ ] cors middleware
- [ ] logging middleware
- [ ] drizzle setup
- [x] setup a health check
- [x] graceful shutdown

- [ ] setup basic client router
- [ ] setup basic ui

- [x] setup Elysia Eden for type-safe API client

- [ ] sign in
- [ ] sign up
- [ ] sign out

- [ ] create project
- [ ] create project members
- [ ] create project roles permissions
- [ ] insert default roles permissions

- [ ] on create project insert default project stages
- [ ] configure project stages
- [ ] delete project stage
- [ ] handle fallback on delete a stage with related tickets on the stage
- [ ] setup default available stages colors
- [ ] color project stages

- [ ] add a ticket
- [ ] delete a ticket
- [ ] edit a ticket
- [ ] move a ticket

- [ ] get roles matrix
- [ ] create role
- [ ] update role
- [ ] delete role
- [ ] handle fallback on delete existing role
- [ ] add rbac middleware

- [ ] add members
- [ ] edit member
- [ ] get members list
- [ ] delete member

- [ ] add tickets labels
- [ ] add tickets assignees

- [ ] filter tickets

- [ ] setup background worker to backup a store

- [ ] keyboard first design

- [ ] task dependencies

- [ ] display board as AI

- [ ] move to rspack
