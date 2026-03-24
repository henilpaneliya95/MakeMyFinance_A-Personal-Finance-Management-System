# Crown Finance Backend

This is the Django backend for the Crown Finance application, providing REST API endpoints for financial tracking and AI insights.

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

## API Endpoints

- `/api/` - Main API routes
- `/admin/` - Django admin interface

## Technologies Used

- Django
- Django REST Framework
- MongoEngine (MongoDB ODM)
- JWT Authentication