# Implementation Tasks

## 1. Backend - Better Auth Setup

- [ ] 1.1 Update `auth.config.ts` to enable email/password authentication
- [ ] 1.2 Run migrations to generate Better Auth user tables (user, session, verification)
- [ ] 1.3 Verify database schema includes necessary tables

## 2. Backend - oRPC Authentication Handlers

- [ ] 2.1 Create sign-up handler that returns "enter" response with profile
- [ ] 2.2 Create sign-in handler that returns "enter" response with profile
- [ ] 2.3 Create sign-out handler that clears cookies
- [ ] 2.4 Create get-profile handler for fetching current user
- [ ] 2.5 Add middleware to extract session from cookies and populate context
- [ ] 2.6 Update router in `api/router.ts` with new handlers

## 3. Frontend - Dependencies and Setup

- [ ] 3.1 Add @solidjs/router to web/package.json
- [ ] 3.2 Create `web/src/lib/rpc.ts` for oRPC client initialization
- [ ] 3.3 Install and verify dependencies

## 4. Frontend - Authentication Pages

- [ ] 4.1 Create `web/src/components/pages/SignIn.tsx` with email/password form
- [ ] 4.2 Create `web/src/components/pages/SignUp.tsx` with email/password form
- [ ] 4.3 Add form validation and error handling
- [ ] 4.4 Implement navigation after successful auth (replace history to home)

## 5. Frontend - Routing and Guards

- [ ] 5.1 Create `web/src/router.tsx` with route definitions
- [ ] 5.2 Implement authenticated route guard that checks session
- [ ] 5.3 Implement unauthenticated route guard for sign-in/sign-up pages
- [ ] 5.4 Store intended destination and redirect after sign-in
- [ ] 5.5 Handle UNAUTHORIZED RPC errors globally (redirect to sign-in, replace history)
- [ ] 5.6 Update `web/src/App.tsx` to use Router

## 6. Frontend - Header Profile Display

- [ ] 6.1 Update `web/src/components/layouts/Header.tsx` to fetch and display profile
- [ ] 6.2 Add dropdown menu with profile info and sign-out option
- [ ] 6.3 Implement sign-out handler that calls RPC and redirects to sign-in

## 7. Testing and Validation

- [ ] 7.1 Test sign-up flow (create account, immediate redirect to home)
- [ ] 7.2 Test sign-in flow (valid credentials, redirect to home or intended destination)
- [ ] 7.3 Test sign-in with invalid credentials (show error)
- [ ] 7.4 Test route protection (unauthenticated access redirects to sign-in)
- [ ] 7.5 Test sign-out (clears session, redirects to sign-in)
- [ ] 7.6 Test history replacement (can't go back after auth redirect)
- [ ] 7.7 Test UNAUTHORIZED error handling from RPC
- [ ] 7.8 Verify profile displays correctly in header
