import requests
import json

# Create new user
signup_data = {"username": "jwttest", "email": "jwttest@test.com", "password": "pass123"}
r1 = requests.post("http://127.0.0.1:8000/api/users/signup/", json=signup_data)
print("Signup:", r1.status_code)

# Login
login_data = {"email": "jwttest@test.com", "password": "pass123"}
r2 = requests.post("http://127.0.0.1:8000/api/users/login/", json=login_data)
print("Login:", r2.status_code)

response_json = r2.json()
token = response_json.get("token", "")
print("\nFull Token:", token)
print("Token length:", len(token))
print("Dot count:", token.count("."))
print("\nToken parts:")
parts = token.split(".")
for i, part in enumerate(parts):
    print(f"  Part {i}: {part[:30]}...")
