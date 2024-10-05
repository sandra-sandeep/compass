from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

# Mock database (replace with actual database in production)
users = {}

def register_user(email, password):
    if not email or not password:
        return {"error": "Email and password are required"}, 400
    
    if email in users:
        return {"error": "User already exists"}, 400
    
    user_id = str(len(users) + 1)
    users[email] = {
        'id': user_id,
        'password': generate_password_hash(password)
    }
    
    token = create_access_token(identity=email)
    return {"userId": user_id, "token": token}, 201

def login_user(email, password):
    if not email or not password:
        return {"error": "Email and password are required"}, 400
    
    user = users.get(email)
    if not user or not check_password_hash(user['password'], password):
        return {"error": "Invalid email or password"}, 401
    
    token = create_access_token(identity=email)
    return {"userId": user['id'], "token": token}, 200