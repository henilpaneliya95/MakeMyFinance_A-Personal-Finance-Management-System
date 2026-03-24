# MakeMy Finance Authentication + OTP (Production Adapted)

## 1. Architecture (Adaptive to Existing Stack)

- Project: MakeMy Finance
- Frontend: React + Vite (`frontend`)
- Backend: Django REST Framework + MongoEngine (`backend`)
- Database: MongoDB (Atlas via MongoEngine for app documents), SQLite for Django internal apps
- Auth strategy: JWT access token for API auth, with OTP verification flows for email verification, optional login 2FA, and password reset

### Why this design fits your codebase

- Existing endpoints and model style were preserved (`User` is MongoEngine document, existing `/api/users/*` endpoints still remain).
- New secure auth flows are added under `/api/auth/*` to avoid breaking old integrations.
- OTP logic is purpose-based (`registration`, `login`, `reset`) and stored in MongoDB with attempt/expiry control.
- Rate limiting uses Django cache (per IP + per email) and is configurable via env.

---

## 2. Backend Modules Added

- `backend/api/auth_serializers.py`
- `backend/api/auth_services.py`
- `backend/api/auth_views.py`
- `backend/api/email_service.py`

## 3. Backend Files Updated

- `backend/api/models.py`
- `backend/api/urls.py`
- `backend/item_service/settings.py`
- `backend/.env.example`
- `backend/requirements.txt`

---

## 4. Data Model Changes

### User (extended)

Added fields:
- `login_id` (optional, unique sparse)
- `role` (`user` or `admin`)
- `email_verified` (bool)
- `two_factor_enabled` (bool)
- `created_at`, `updated_at`, `last_login_at`

### OTPVerification (new)

Fields:
- `identifier` (email)
- `otp` (hashed)
- `purpose` (`registration|login|reset`)
- `expires_at`
- `is_used`
- `attempt_count`
- `max_attempts`
- `created_at`, `used_at`

Indexed for fast lookups on identifier/purpose/state/expiry.

---

## 5. API Contracts

Base: `/api/auth`

### Register (start registration OTP)

- `POST /register/`
- Request:
```json
{
  "username": "demo",
  "email": "demo@example.com",
  "password": "StrongPass123!",
  "role": "user"
}
```
- Success:
```json
{
  "message": "OTP sent to your email.",
  "requires_otp": true,
  "purpose": "registration",
  "identifier": "demo@example.com"
}
```

### Verify OTP (generic purpose)

- `POST /verify-otp/`
- Request:
```json
{
  "email": "demo@example.com",
  "otp": "123456",
  "purpose": "registration"
}
```
- Success:
```json
{
  "message": "OTP verified successfully."
}
```

### Login

- `POST /login/`
- Request:
```json
{
  "email": "demo@example.com",
  "password": "StrongPass123!"
}
```
- Success (no login OTP required):
```json
{
  "message": "Login successful.",
  "requires_otp": false,
  "access_token": "<jwt>",
  "token": "<jwt>",
  "user": {
    "id": "...",
    "username": "demo",
    "email": "demo@example.com",
    "role": "user",
    "email_verified": true
  }
}
```
- Success (login OTP required):
```json
{
  "message": "OTP sent for login verification.",
  "requires_otp": true,
  "purpose": "login",
  "identifier": "demo@example.com"
}
```

### Verify Login OTP

- `POST /verify-login-otp/`
- Request:
```json
{
  "email": "demo@example.com",
  "otp": "123456"
}
```
- Success:
```json
{
  "message": "Login OTP verified.",
  "access_token": "<jwt>",
  "token": "<jwt>",
  "user": {
    "id": "...",
    "username": "demo",
    "email": "demo@example.com",
    "role": "user",
    "email_verified": true
  }
}
```

### Forgot Password

- `POST /forgot-password/`
- Request:
```json
{
  "email": "demo@example.com"
}
```
- Success (enumeration-safe):
```json
{
  "message": "If this email exists, an OTP has been sent."
}
```

### Reset Password

- `POST /reset-password/`
- Request:
```json
{
  "email": "demo@example.com",
  "otp": "123456",
  "new_password": "NewStrongPass123!"
}
```
- Success:
```json
{
  "message": "Password reset successful."
}
```

### Resend OTP

- `POST /resend-otp/`
- Request:
```json
{
  "email": "demo@example.com",
  "purpose": "registration"
}
```
- Success:
```json
{
  "message": "OTP sent successfully."
}
```

### Logout

- `POST /logout/`
- Request: optional payload with refresh token
- Success:
```json
{
  "message": "Logged out successfully."
}
```

---

## 6. SMTP Setup Guide (Beginner Friendly)

### Required env vars

Set these in `backend/.env`:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL`

Optional but useful:

- `EMAIL_BACKEND` (`django.core.mail.backends.console.EmailBackend` for dev, SMTP backend for production)
- `EMAIL_USE_TLS=True`

### Gmail SMTP example

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM_EMAIL=your-gmail@gmail.com
EMAIL_USE_TLS=True
```

How to get Gmail App Password:
1. Enable 2-Step Verification in Google Account.
2. Go to Google Account -> Security -> App Passwords.
3. Create app password for Mail.
4. Use generated 16-char password in `SMTP_PASSWORD`.

### Outlook SMTP example

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password-or-app-password
SMTP_FROM_EMAIL=your-email@outlook.com
EMAIL_USE_TLS=True
```

### Dev vs production behavior

- Development: use console backend or Mailtrap.
- Production: use real SMTP (Gmail app password, Outlook, SES, SendGrid SMTP relay, etc).
- OTP mail failures are caught and surfaced in API responses where appropriate.

### Security rules

- Never hardcode SMTP credentials.
- Keep all secrets only in environment variables.
- Rotate credentials if exposed.

---

## 7. Frontend Implementation (React)

New pages:
- `frontend/src/pages/OtpVerification.jsx`
- `frontend/src/pages/ForgotPassword.jsx`
- `frontend/src/pages/ResetPassword.jsx`

Updated pages:
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Signup.jsx`
- `frontend/src/App.jsx`

Flow state persistence utilities:
- `frontend/src/utils/authFlow.js`

Stored keys:
- `pendingRegistration`
- `pendingLogin`
- `pendingReset`

Behavior:
- Restores pending flows on refresh.
- Handles OTP contexts (`registration`, `login`, `reset`).
- Includes resend timer and loading/error states.
- Clears temporary state after success.

---

## 8. Security Controls Implemented

- Password hashing via Django hashers (`make_password`, `check_password`)
- JWT access token with user claims (`email`, `username`, `role`)
- OTP stored hashed (HMAC SHA-256)
- OTP expiry and max-attempt lockout
- Purpose-based OTP handling
- Rate limit per IP and per email using cache
- User-enumeration-safe forgot-password response

---

## 9. Testing

### Backend tests added

- `backend/api/test_auth_otp.py`

Coverage includes:
- Registration + OTP verification + login
- Forgot password + reset password
- OTP attempt limit behavior
- Token generation basic validation

Command:
```bash
backend/.venv/Scripts/python.exe backend/manage.py test api.test_auth_otp -v 2
```
Expected result:
- `Ran 4 tests ... OK`

### Frontend tests added

- `frontend/src/utils/authFlow.test.js`

Coverage includes:
- Pending flow save/restore
- Clear single/all flow state
- Resend countdown calculation

Command:
```bash
cd frontend
npm run test
```
Expected result:
- `Test Files 1 passed`
- `Tests 3 passed`

---

## 10. Recommended Production Next Steps

1. Enable `AUTH_REQUIRE_LOGIN_OTP=True` if mandatory login 2FA is desired.
2. Add refresh token rotation + blacklist for strict logout security.
3. Move rate limiting to Redis cache backend for multi-instance deployments.
4. Add centralized audit logging for auth events (OTP requests, verification, lockouts).
