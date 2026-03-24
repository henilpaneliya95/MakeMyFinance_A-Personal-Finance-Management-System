from mongoengine import connect
import os
from urllib.parse import quote_plus

# Test MongoDB connection
try:
    connect(
        db='item_db',
        host="mongodb://localhost:27017/item_db"
    )
    print("Connected to local MongoDB successfully")
except Exception as e:
    print(f"Local MongoDB connection failed: {e}")

    # Try Atlas
    try:
        username = os.getenv("MONGODB_USER")
        password = quote_plus(os.getenv("MONGODB_PASS"))
        host = os.getenv("MONGODB_HOST")
        db_name = os.getenv("MONGODB_DATABASE_NAME")

        MONGODB_URI = f"mongodb+srv://{username}:{password}@{host}/{db_name}?retryWrites=true&w=majority&appName=CrownFinance"

        connect(
            db=db_name,
            host=MONGODB_URI
        )
        print("Connected to Atlas MongoDB successfully")
    except Exception as e2:
        print(f"Atlas MongoDB connection failed: {e2}")