# MakeMy Finance Backend

This is the Django backend for the MakeMy Finance application, providing REST API endpoints for financial tracking and AI insights.

## Setup

1. Ensure you have Python 3.8+ installed.

2. Create a virtual environment:
   ```
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - Windows: `.venv\Scripts\activate`
   - Linux/Mac: `source .venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required values (MongoDB credentials, SECRET_KEY, etc.)

6. Run database migrations:
   ```
   python manage.py migrate
   ```

## Running the Backend

Use the convenience script:
```
.\run_backend.ps1
```

Or directly:
```
python main.py runserver
```

The server will start on `http://127.0.0.1:8000` by default.

## Production (Render)

This repository includes deployment configuration for Render:

- `../render.yaml` for service root/build/start commands
- `runtime.txt` to pin Python version (`3.11.11`)

Important production env vars:

- `SECRET_KEY`
- `DEBUG=False`
- `ALLOWED_HOSTS` (include your `.onrender.com` domain)
- `RENDER_EXTERNAL_URL` (full HTTPS URL of your Render service)
- `MONGODB_USER`, `MONGODB_PASS`, `MONGODB_HOST`, `MONGODB_DATABASE_NAME`
- `AUTH_REQUIRE_LOGIN_OTP=True` (if you want OTP on every login)
- SMTP vars (`EMAIL_BACKEND`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_USE_TLS`, `SMTP_FROM_EMAIL`)

## API Endpoints

- `/api/` - Main API routes
- `/admin/` - Django admin interface

## Technologies Used

- Django
- Django REST Framework
- MongoEngine (MongoDB ODM)
- JWT Authentication