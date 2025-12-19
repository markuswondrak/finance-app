# Quickstart: Google Authentication

**Feature**: 012-google-auth

## Prerequisites

1.  **Google Cloud Console Project**:
    - Create a project at [console.cloud.google.com](https://console.cloud.google.com/).
    - Enable "Google+ API" or "Google People API" (for profile info).
    - Configure **OAuth Consent Screen** (External, Test Users).
    - Create **OAuth 2.0 Client IDs** (Web Application).
        - **Authorized Origins**: `http://localhost:8080` (Frontend), `http://localhost:8082` (Backend - if needed for testing, usually just frontend origin is enough for CORS).
        - **Authorized Redirect URIs**: `http://localhost:8082/auth/google/callback` (Backend Callback Handler).

2.  **Environment Variables**:
    Create or update your `.env` file in the `backend/` directory:

    ```env
    GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=your_client_secret
    GOOGLE_REDIRECT_URL=http://localhost:8082/auth/google/callback
    JWT_SECRET=your_super_secret_random_string_min_32_chars
    APP_ENV=development # or production
    FRONTEND_URL=http://localhost:8080 # For CORS and Redirects
    ```

## Running Locally

1.  **Backend**:
    ```bash
    cd backend
    go mod tidy
    go run main.go
    ```

2.  **Frontend**:
    ```bash
    cd frontend
    pnpm install
    pnpm dev
    ```

## Testing the Flow

1.  Open `http://localhost:8080` (Landing Page).
2.  Click **"Log in with Google"** or **"Register"**.
3.  You should be redirected to Google.
4.  After consent, you should be redirected back to `http://localhost:8080/overview`.
5.  **Verification**:
    - Check your browser cookies: `auth_token` should be present, `HttpOnly`, and `Secure` (if HTTPS) or not (if localhost dev).
    - The top-right corner should show your Google Name and Avatar.
    - Refresh the page; you should stay logged in.
    - Click avatar -> "Log Out". You should be redirected to `/`.

## Troubleshooting

-   **Redirect URI Mismatch**: Ensure `GOOGLE_REDIRECT_URL` in `.env` EXACTLY matches the one in Google Cloud Console.
-   **CORS Errors**: Check `FRONTEND_URL` in `.env` and backend CORS middleware configuration.
-   **Cookie Not Set**: Check if `Secure` flag is `true` on `http://localhost`. Browsers block secure cookies on insecure localhost (except Chrome sometimes). Set `Secure=false` for local dev.
