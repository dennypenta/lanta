<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## Project Overview

Lanta is a task management application.

### Tech Stack

- **Runtime**: Bun
- **API Framework**: Elysia
- **Authentication**: Better Auth with Drizzle adapter
- **Database**: Drizzle ORM + SQLite
- **Validation**: Valibot
- **Frontend**: SolidJS + Solid Router
- **UI Components**: Kobalte UI
- **Styling**: Tailwind CSS

## Development Commands

### Running the Application

```bash
bun api/index.ts              # Run the API server (PORT from .env.example)
```

### Database Management

```bash
bun migrate:generate          # Generate Drizzle migrations from schema
bun migrate:migrate           # Apply migrations to the database
```

### Code Quality

```bash
bun lint                      # Lint code with ESLint
bun lint:fix                  # Auto-fix linting issues
bun format                    # Format code with Prettier
bun format:check              # Check code formatting
```

## Architecture

### Architecture Details

- **Runtime**: Bun (configured with `bunfig.toml`)
- **Database**: Drizzle ORM + SQLite
- **Authentication**: Better Auth with Drizzle adapter
- **Validation**: Valibot schemas
- **API**: Elysia framework

### Directory Structure

```
api/
├── auth/              # Better Auth configuration and schema
├── config/            # Environment config with Zod validation
├── db/
│   ├── db.ts         # Database initialization (newDB function)
│   ├── schema.ts     # Drizzle schema definitions
│   └── migrations/   # Drizzle migration files
├── index.ts          # API server entry point
└── globals.d.ts      # TypeScript globals
```

### Configuration

Environment variables are validated using Valibot schemas in `api/config/config.ts`:

- `PORT` - Server port
- `DB_FILE_NAME` - SQLite database file path
- `BETTER_AUTH_SECRET` - Auth secret key
- `BETTER_AUTH_URL` - Auth callback URL

### Database Schema

Current tables:

- `projects` - Project definitions with name, description, timestamps
- `project_members` - Project membership with userId, projectId, role
  - Composite unique constraint on (projectId, userId)
  - Indexes on projectId and userId for performance

### Server Details

- Entry point: `api/index.ts`
- Health check endpoint: `/health`

## Development Notes

### Adding Database Tables

1. Update `api/db/schema.ts` with new table definitions
2. Run `bun migrate:generate` to create migration
3. Run `bun migrate:migrate` to apply migration

### Code Style

- ESLint and Prettier configured for code quality
- Prettier plugins: organize-imports, tailwindcss
- TypeScript strict mode enabled
- Auto-fix linting with `bun lint:fix`
- Format checking with `bun format:check`
