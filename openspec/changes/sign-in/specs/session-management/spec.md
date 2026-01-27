# Session Management Capability

## ADDED Requirements

### Requirement: Cookie-Based Session Storage

The system SHALL use HTTP cookies for session persistence.

#### Scenario: Session cookie set on authentication

- **WHEN** a user successfully signs in or signs up
- **THEN** the system sets session cookies in the HTTP response
- **AND** cookies are marked as HttpOnly and Secure (in production)

#### Scenario: Session cookie sent with requests

- **WHEN** an authenticated user makes an API request
- **THEN** the browser automatically includes session cookies
- **AND** the server extracts session information from cookies

#### Scenario: Session cookie cleared on sign-out

- **WHEN** a user signs out
- **THEN** the system clears session cookies from the response
- **AND** subsequent requests are unauthenticated

### Requirement: Session Context in Route Handlers

The system SHALL populate route handler context with session information for authenticated requests.

#### Scenario: Authenticated request context

- **WHEN** a route handler receives a request with valid session cookies
- **THEN** the middleware extracts the session
- **AND** populates the context with user information (id, email, profile)

#### Scenario: Unauthenticated request context

- **WHEN** a route handler receives a request without valid session cookies
- **THEN** the context indicates no authenticated user
- **AND** protected handlers return UNAUTHORIZED error

### Requirement: Single Session Duration

The system SHALL use a single session duration for all users.

#### Scenario: Session duration configured

- **WHEN** Better Auth is configured
- **THEN** all sessions have the same expiration time
- **AND** there is no "remember me" option

#### Scenario: Session expiration

- **WHEN** a session expires
- **THEN** subsequent requests with expired cookies are treated as unauthenticated
- **AND** the user must sign in again

### Requirement: Stateless Session Validation

The system SHALL validate sessions on every request without maintaining server-side session state.

#### Scenario: Session validation on each request

- **WHEN** a route handler receives a request
- **THEN** Better Auth validates the session token from cookies
- **AND** verification happens without querying a session store for active sessions

#### Scenario: Invalid session token

- **WHEN** a route handler receives a request with an invalid or tampered session token
- **THEN** the request is treated as unauthenticated
- **AND** returns UNAUTHORIZED error for protected resources
