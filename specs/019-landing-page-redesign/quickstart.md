# Quickstart: Landing Page Redesign

## Overview
This feature implements a new, responsive, German-language landing page with a savings calculator. It replaces the existing entry point.

## Development Setup

1. **Start Backend** (optional for this feature, but good for auth check):
   ```bash
   cd backend
   go run main.go
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access**: Open `http://localhost:8080/`.
   - **Note**: Ensure you are logged OUT (clear cookies/storage or incognito) to see the landing page. If logged in, you will be redirected to `/overview`.

## key Components
- `src/components/landing/LandingPage.vue`: The main entry component.
- `src/components/landing/SavingsCalculator.vue`: The logic-heavy component.

## Testing

**Unit Tests**:
```bash
cd frontend
npm run test:unit src/tests/unit/components/landing/
```
