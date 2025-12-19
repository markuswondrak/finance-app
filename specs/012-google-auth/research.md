# Research: Google Authentication & Session Management

**Feature**: Google Authentication (012-google-auth)
**Date**: 2025-12-19
**Status**: Complete

## 1. OAuth 2.0 Flow Strategy

**Decision**: Implement **Authorization Code Flow with PKCE**.

**Rationale**:
- **Security**: PKCE (Proof Key for Code Exchange) protects against authorization code interception attacks, which is critical for Single Page Applications (SPAs) like our Vue.js frontend.
- **Industry Standard**: This is the current best practice recommended by OAuth 2.0 security best current practices for browser-based apps.
- **Library Support**: Well-supported by Go's `golang.org/x/oauth2` library and Vue.js ecosystem.

**Alternatives Considered**:
- *Implicit Flow*: Deprecated due to security vulnerabilities (returning tokens in the URL fragment).
- *Authorization Code Flow (without PKCE)*: Less secure for public clients (SPAs) as it requires storing a client secret or lacks the code verifier check.

## 2. Session Management

**Decision**: Use **HTTP-only, Secure, SameSite=Lax Cookies containing a JWT**.

**Rationale**:
- **XSS Protection**: `HttpOnly` flag prevents client-side JavaScript (and thus XSS attacks) from reading the token.
- **CSRF Protection**: `SameSite=Lax` provides sensible default protection against Cross-Site Request Forgery for top-level navigations while allowing the login flow to complete.
- **Statelessness**: JWTs allow the backend to remain stateless (no server-side session storage required), fitting the Go/Gin architecture.
- **Simplicity**: No need for a separate store (Redis/DB) for session IDs, simplifying infrastructure.

**Configuration Details**:
- **Cookie Name**: `auth_token` (or similar)
- **Flags**: `HttpOnly=true`, `Secure=true` (in production), `SameSite=Lax`, `Path=/`
- **Expiration**: Matches JWT expiration (e.g., 24 hours).

**Alternatives Considered**:
- *LocalStorage/SessionStorage*: Vulnerable to XSS attacks as tokens are accessible by JS.
- *Server-side Sessions*: Adds infrastructure complexity (Redis/DB) and statefulness to the backend.

## 3. Avatar Storage

**Decision**: **Store the Google Avatar URL** directly in the `User` entity.

**Rationale**:
- **Simplicity**: No need to build image downloading, processing, and storage infrastructure (S3, etc.).
- **Performance**: Leveraging Google's CDN for image delivery offloads bandwidth from our server.
- **Privacy/Control**: Users control their avatar on Google; updates propagate (eventually) or stay consistent with their public profile.

**Trade-offs**:
- Dependent on Google's availability (low risk).
- URL might break if the user deletes their Google account (acceptable edge case; can fallback to a default avatar).

**Alternatives Considered**:
- *Download and Serve from Backend*: Increases bandwidth/storage costs and implementation complexity.
- *Upload to S3*: Overkill for a simple avatar feature at this stage.

## 4. Frontend Library

**Decision**: Use **`vue3-google-login`** (or similar lightweight wrapper) or direct usage of Google Identity Services SDK.

**Rationale**:
- Simplifies the initialization of the Google Sign-In client.
- Provides Vue 3 composables/components for easy integration.

## 5. Backend Library

**Decision**: Use **`golang.org/x/oauth2`** and **`golang.org/x/oauth2/google`**.

**Rationale**:
- The official Go OAuth2 library.
- Robust, well-maintained, and supports the standard flows including `AuthCodeURL` generation and `Exchange`.
