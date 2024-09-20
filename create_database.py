from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")

# Create database and collection
db = client["user_database"]
collection = db["users"]

# Create the initial user document structure
initial_user = {
    'name': '',
    'username': '',
    'email': '',
    'password': '',  # Store hashed passwords only
    'login_attempts': 0,
    'banned_until': None
}

# Example: Insert a sample user (optional, for testing)
sample_users = [
    {
        'name': 'John Doe',
        'username': 'john_doe',
        'email': 'john@example.com',
        'password': 'hashed_password_here',  # Replace with a hashed password
        'login_attempts': 0,
        'banned_until': None
    },
    {
        'name': 'Jane Smith',
        'username': 'jane_smith',
        'email': 'jane@example.com',
        'password': 'hashed_password_here',  # Replace with a hashed password
        'login_attempts': 0,
        'banned_until': None
    }
]

# Insert sample users (uncomment if needed)
# collection.insert_many(sample_users)

print("Database and collection created successfully!")
