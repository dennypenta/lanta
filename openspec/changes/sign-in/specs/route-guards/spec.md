# Route Guards Capability

## ADDED Requirements

### Requirement: Protected Route Access Control

The system SHALL prevent unauthenticated users from accessing protected application routes.

#### Scenario: Unauthenticated user accesses protected route

- **WHEN** an unauthenticated user navigates to a protected route
- **THEN** the system stores the intended destination
- **AND** redirects the user to the sign-in page using history replacement
- **AND** the user cannot navigate back to the protected page

#### Scenario: Authenticated user accesses protected route

- **WHEN** an authenticated user navigates to a protected route
- **THEN** the system allows access
- **AND** renders the protected page normally

### Requirement: Authentication Page Access Control

The system SHALL redirect authenticated users away from authentication pages.

#### Scenario: Authenticated user accesses sign-in page

- **WHEN** an authenticated user navigates to the sign-in or sign-up page
- **THEN** the system redirects to the home page using history replacement
- **AND** the user cannot navigate back to the auth page

#### Scenario: Unauthenticated user accesses sign-in page

- **WHEN** an unauthenticated user navigates to the sign-in or sign-up page
- **THEN** the system allows access
- **AND** displays the authentication form

### Requirement: Post-Authentication Redirection

The system SHALL redirect users to their intended destination after successful authentication.

#### Scenario: Sign-in after protected route attempt

- **WHEN** a user signs in after being redirected from a protected route
- **THEN** the system redirects to the originally intended destination using history replacement
- **AND** clears the stored intended destination

#### Scenario: Direct sign-in without previous redirect

- **WHEN** a user signs in without a stored intended destination
- **THEN** the system redirects to the home page using history replacement

#### Scenario: Sign-up completion

- **WHEN** a user completes sign-up
- **THEN** the system redirects to the home page using history replacement

### Requirement: UNAUTHORIZED Error Handling

The system SHALL handle UNAUTHORIZED errors from oRPC by redirecting to sign-in.

#### Scenario: UNAUTHORIZED error from RPC call

- **WHEN** an oRPC handler returns an UNAUTHORIZED error code
- **THEN** the frontend stores the current location as intended destination
- **AND** redirects the user to the sign-in page using history replacement
- **AND** the user cannot navigate back to the previous page

#### Scenario: Multiple UNAUTHORIZED errors

- **WHEN** multiple concurrent RPC calls return UNAUTHORIZED errors
- **THEN** the system handles the redirect once
- **AND** does not create multiple redirects or history entries

### Requirement: History Replacement for Auth Navigation

The system SHALL use history replacement instead of push for all authentication-related navigation.

#### Scenario: Redirect to sign-in replaces history

- **WHEN** the system redirects a user to the sign-in page
- **THEN** it uses history.replaceState or router replace
- **AND** the browser back button does not return to the protected page

#### Scenario: Redirect after sign-in replaces history

- **WHEN** the system redirects after successful sign-in
- **THEN** it uses history.replaceState or router replace
- **AND** the browser back button does not return to the sign-in page

### Requirement: SolidJS Router Integration

The system SHALL use @solidjs/router for route guards and navigation.

#### Scenario: Router configuration with guards

- **WHEN** the application initializes
- **THEN** @solidjs/router is configured with route definitions
- **AND** protected routes are wrapped with authentication guard component

#### Scenario: Route guard implementation

- **WHEN** a route guard evaluates access
- **THEN** it checks for valid authentication state
- **AND** uses router.replace() for redirection to maintain history replacement behavior

### Requirement: Profile Display in Header

The system SHALL display the authenticated user's profile in the application header.

#### Scenario: Profile display when authenticated

- **WHEN** an authenticated user views the header
- **THEN** the system displays the user's profile information
- **AND** provides access to a dropdown menu

#### Scenario: Profile dropdown menu

- **WHEN** an authenticated user clicks on their profile in the header
- **THEN** a dropdown menu appears
- **AND** contains profile information and a sign-out option

#### Scenario: Sign-out from dropdown

- **WHEN** a user clicks sign-out from the dropdown menu
- **THEN** the system calls the sign-out oRPC handler
- **AND** redirects to the sign-in page using history replacement
- **AND** clears the user's profile from the header

#### Scenario: Profile not displayed when unauthenticated

- **WHEN** an unauthenticated user views the header
- **THEN** the profile display is not shown
- **AND** no dropdown menu is available
