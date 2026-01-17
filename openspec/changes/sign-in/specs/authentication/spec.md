# Authentication Capability

## ADDED Requirements

### Requirement: User Registration

The system SHALL allow users to create accounts using email and password credentials.

#### Scenario: Successful registration with valid credentials

- **WHEN** a user provides a unique email and valid password via the sign-up handler
- **THEN** the system creates a new user account
- **AND** returns an "enter" response containing the user profile
- **AND** sets authentication cookies for the session

#### Scenario: Registration with duplicate email

- **WHEN** a user attempts to register with an email that already exists
- **THEN** the system returns a validation error indicating the email is taken
- **AND** does not create a duplicate account

#### Scenario: Registration with invalid password

- **WHEN** a user provides a password that doesn't meet minimum requirements
- **THEN** the system returns a validation error describing the password requirements

### Requirement: User Sign-In

The system SHALL allow registered users to sign in using their email and password.

#### Scenario: Successful sign-in with valid credentials

- **WHEN** a user provides valid email and password credentials via the sign-in handler
- **THEN** the system authenticates the user
- **AND** returns an "enter" response containing the user profile
- **AND** sets authentication cookies for the session

#### Scenario: Sign-in with invalid credentials

- **WHEN** a user provides incorrect email or password
- **THEN** the system returns an authentication error
- **AND** does not create a session

#### Scenario: Sign-in for non-existent user

- **WHEN** a user attempts to sign in with an email not in the system
- **THEN** the system returns an authentication error
- **AND** does not reveal whether the email exists

### Requirement: User Sign-Out

The system SHALL allow authenticated users to sign out and terminate their session.

#### Scenario: Successful sign-out

- **WHEN** an authenticated user calls the sign-out handler
- **THEN** the system invalidates the current session
- **AND** clears authentication cookies
- **AND** returns a success response

#### Scenario: Sign-out when not authenticated

- **WHEN** an unauthenticated user calls the sign-out handler
- **THEN** the system returns a success response without error

### Requirement: Profile Retrieval

The system SHALL provide a way to retrieve the current authenticated user's profile.

#### Scenario: Get profile when authenticated

- **WHEN** an authenticated user calls the get-profile handler
- **THEN** the system returns the user profile containing id, email, and display name

#### Scenario: Get profile when not authenticated

- **WHEN** an unauthenticated user calls the get-profile handler
- **THEN** the system returns an UNAUTHORIZED error

### Requirement: Better Auth Integration

The system SHALL use Better Auth with Drizzle adapter for all authentication operations.

#### Scenario: Email and password provider enabled

- **WHEN** the authentication system is configured
- **THEN** Better Auth is initialized with email/password authentication provider
- **AND** uses Drizzle adapter with SQLite

#### Scenario: No email verification required

- **WHEN** a user completes registration
- **THEN** the user can immediately sign in without email verification

### Requirement: Authentication API Structure

The system SHALL expose authentication operations through oRPC handlers.

#### Scenario: Sign-up handler

- **WHEN** the sign-up handler receives email and password
- **THEN** it creates a user via Better Auth
- **AND** writes session cookies to the response
- **AND** returns an "enter" response with profile field

#### Scenario: Sign-in handler

- **WHEN** the sign-in handler receives email and password
- **THEN** it authenticates via Better Auth
- **AND** writes session cookies to the response
- **AND** returns an "enter" response with profile field

#### Scenario: Sign-out handler

- **WHEN** the sign-out handler is called
- **THEN** it invalidates the session via Better Auth
- **AND** clears session cookies from the response

#### Scenario: Get-profile handler

- **WHEN** the get-profile handler is called with a valid session
- **THEN** it returns the user profile from the session context
