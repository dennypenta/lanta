# Change: Add User Sign In and Sign Up with Better Auth

## Why

The application currently has no authentication system, meaning there's no way to identify users or protect resources. Users need to be able to create accounts, sign in, and have their identity verified for all protected operations. This is foundational for the task management features that require user context.

## What Changes

- Add sign-up functionality with email and password (immediate access, no email verification)
- Add sign-in functionality with email and password
- Implement cookie-based session management via Better Auth
- Create Elysia route handlers for sign-up, sign-in, and sign-out operations
- Add profile display in the header with dropdown menu and sign-out option
- Implement route guards using @solidjs/router to protect authenticated pages
- Handle UNAUTHORIZED errors from RPC by redirecting to sign-in
- Redirect authenticated users from sign-in page to home page
- Use history replacement (not push) for auth-related navigation to prevent back-button issues
- Remember intended destination and redirect after successful sign-in

## Impact

- Affected specs: authentication (new), session-management (new), route-guards (new)
- Affected code:
  - `auth.config.ts` - Configure Better Auth with email/password provider
  - `api/router.ts` - Add sign-up, sign-in, sign-out, and get-profile handlers
  - `api/db/schema.ts` - Better Auth will auto-generate user tables via migrations
  - `web/src/App.tsx` - Wrap with Router provider
  - `web/src/components/layouts/Header.tsx` - Add profile display and dropdown menu
  - New files:
    - `web/src/router.tsx` - Route configuration with guards
    - `web/src/components/pages/SignIn.tsx` - Sign-in page
    - `web/src/components/pages/SignUp.tsx` - Sign-up page
    - `web/src/contexts/AuthContext.tsx` - Auth state management (optional)
    - `web/src/lib/api.ts` - Eden Treaty client setup
