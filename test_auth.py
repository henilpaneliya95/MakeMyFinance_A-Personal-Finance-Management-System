import requests
import json
import uuid
from datetime import datetime

BASE_URL = "http://localhost:8000/api"

# Generate unique email for testing
test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
test_password = "testpass123"
test_username = f"testuser_{uuid.uuid4().hex[:6]}"

print("=" * 60)
print("🧪 TESTING SIGNUP & LOGIN")
print("=" * 60)

# ============= SIGNUP TEST =============
print("\n1️⃣  SIGNUP TEST")
print(f"   Email: {test_email}")
print(f"   Password: {test_password}")
print(f"   Username: {test_username}")

signup_data = {
    "username": test_username,
    "email": test_email,
    "password": test_password
}

try:
    signup_response = requests.post(
        f"{BASE_URL}/users/signup/",
        json=signup_data,
        timeout=10
    )
    
    print(f"\n   Status Code: {signup_response.status_code}")
    print(f"   Response: {json.dumps(signup_response.json(), indent=2)}")
    
    if signup_response.status_code == 201:
        print("   ✅ SIGNUP SUCCESSFUL!")
    else:
        print("   ❌ SIGNUP FAILED!")
        
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

# ============= LOGIN TEST =============
print("\n" + "=" * 60)
print("2️⃣  LOGIN TEST")
print(f"   Email: {test_email}")
print(f"   Password: {test_password}")

login_data = {
    "email": test_email,
    "password": test_password
}

try:
    login_response = requests.post(
        f"{BASE_URL}/users/login/",
        json=login_data,
        timeout=10
    )
    
    print(f"\n   Status Code: {login_response.status_code}")
    response_json = login_response.json()
    
    # Don't print full token for security
    if "token" in response_json:
        print(f"   Token: {response_json['token'][:50]}...")
        
    print(f"   Full Response: {json.dumps(response_json, indent=2)}")
    
    if login_response.status_code == 200:
        print("   ✅ LOGIN SUCCESSFUL!")
        if "token" in response_json:
            print(f"   ✅ JWT Token received!")
    else:
        print("   ❌ LOGIN FAILED!")
        
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

print("\n" + "=" * 60)
print("🏁 TEST COMPLETED")
print("=" * 60)
