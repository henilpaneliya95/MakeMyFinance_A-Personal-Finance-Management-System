import sys
import os
sys.path.insert(0, 'D:\\MakeMy Finance-main\\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'item_service.settings')

import django
django.setup()

from api.models import User

# अंतिम 3 users को देखें
print("=" * 70)
print("📊 DATABASE में USERS")
print("=" * 70)

users = User.objects.all().order_by('-id')[:5]

for idx, user in enumerate(users, 1):
    print(f"\n{idx}. User ID: {user.id}")
    print(f"   Username: {user.username}")
    print(f"   Email: {user.email}")
    print(f"   Password Hash: {user.password[:50]}...")
    print(f"   Password Length: {len(user.password)}")
    
    # Test password verification
    test_passwords = [
        "testpass123",
        "test",
        user.password
    ]
    
    for test_pwd in test_passwords:
        try:
            result = user.check_password(test_pwd)
            print(f"   - check_password('{test_pwd[:10]}...'): {result}")
        except:
            print(f"   - check_password('{test_pwd[:10]}...'): ERROR")

print("\n" + "=" * 70)
