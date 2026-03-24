import os
import django
from dotenv import load_dotenv
load_dotenv()

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'item_service.settings')
django.setup()

print('Environment variables:')
print(f'MONGODB_USER: {os.getenv("MONGODB_USER")}')
print(f'MONGODB_PASS: {repr(os.getenv("MONGODB_PASS"))}')
print(f'MONGODB_HOST: {os.getenv("MONGODB_HOST")}')
print(f'MONGODB_DATABASE_NAME: {os.getenv("MONGODB_DATABASE_NAME")}')

# Test connection
from mongoengine import connect
from urllib.parse import quote_plus

username = os.getenv('MONGODB_USER')
password = quote_plus(os.getenv('MONGODB_PASS'))
host = os.getenv('MONGODB_HOST')
db_name = os.getenv('MONGODB_DATABASE_NAME')

MONGODB_URI = f'mongodb+srv://{username}:{password}@{host}/{db_name}?retryWrites=true&w=majority&appName=Crown Finance'
print(f'Full URI: {MONGODB_URI}')

try:
    connect(db=db_name, host=MONGODB_URI)
    print('✅ Connected to MongoDB Atlas successfully!')

    # Test data insertion
    from api.models import User
    test_user = User(username='atlas_test2', email='atlas2@test.com')
    test_user.set_password('test123')
    test_user.save()
    print('✅ Test user saved successfully!')

    # Check all users
    all_users = User.objects()
    print(f'Total users in Atlas: {len(all_users)}')
    for user in all_users:
        print(f'- {user.username}: {user.email}')

except Exception as e:
    print(f'❌ Error: {e}')