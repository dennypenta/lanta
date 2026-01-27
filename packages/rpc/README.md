# @lanta/rpc

Shared validation schemas, types, and utilities for Lanta monorepo.

## Usage

### In API (Backend)

```typescript
import { createProjectSchema, type Project } from '@lanta/rpc/schemas'
import { Value } from 'typebox/value'

// Validate request body
app.post('/api/projects', async (req) => {
  const body = Value.Parse(createProjectSchema, req.body)
  // body is now typed as CreateProject

  const project = await db.insert(projects).values(body)
  return project
})
```

### In Web (Frontend)

```typescript
import { createProjectSchema, type CreateProject } from "@lanta/rpc/schemas";
import { Value } from "typebox/value";
import { createSignal } from "solid-js";

function CreateProjectForm() {
  const [formData, setFormData] = createSignal<CreateProject>({
    name: "",
    description: null,
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    // Validate with same schema as backend
    const isValid = Value.Check(createProjectSchema, formData());

    if (!isValid) {
      const errors = [...Value.Errors(createProjectSchema, formData())];
      console.error(errors);
      return;
    }

    // Send validated data to API
    fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify(formData()),
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Using Types Only

```typescript
import type { Project, ApiResponse } from '@lanta/rpc/types'

const fetchProjects = async (): Promise<ApiResponse<Project[]>> => {
  const response = await fetch('/api/projects')
  return response.json()
}
```

## Structure

```
rpc/
├── src/
│   ├── schemas/       # TypeBox validation schemas
│   │   ├── project.ts
│   │   ├── member.ts
│   │   └── index.ts
│   ├── types/         # TypeScript types
│   │   └── index.ts
│   └── index.ts       # Main entry point
└── package.json
```

## Adding New Schemas

1. Create schema file in `src/schemas/`
2. Export from `src/schemas/index.ts`
3. Re-export types in `src/types/index.ts` if needed
