# A simple app to test the OpenAI API

import os
from dotenv import load_dotenv
from openai import OpenAI
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Change this!
jwt = JWTManager(app)

client = OpenAI()

# Mock database (replace with actual database in production)
users = {}
entries = {}

# User Authentication Endpoints

@app.route('/api/auth/register', methods=['POST'])
def register_user():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    if email in users:
        return jsonify({"error": "User already exists"}), 400
    
    user_id = str(len(users) + 1)
    users[email] = {
        'id': user_id,
        'password': generate_password_hash(password)
    }
    
    token = create_access_token(identity=email)
    return jsonify({"userId": user_id, "token": token}), 201

@app.route('/api/auth/login', methods=['POST'])
def login_user():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    user = users.get(email)
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid email or password"}), 401
    
    token = create_access_token(identity=email)
    return jsonify({"userId": user['id'], "token": token}), 200

# Journal Entry Endpoints

@app.route('/api/entries', methods=['POST'])
@jwt_required()
def create_entry():
    # TODO: Replace with actual database query
    title = request.json.get('title', None)
    content = request.json.get('content', None)
    
    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400
    
    entry_id = str(len(entries) + 1)
    now = datetime.now(timezone.utc)
    entry = {
        'id': entry_id,
        'title': title,
        'content': content,
        'createdAt': now,
        'updatedAt': now,
        'user': get_jwt_identity()
    }
    entries[entry_id] = entry
    
    return jsonify(entry), 201

@app.route('/api/entries', methods=['GET'])
@jwt_required()
def get_all_entries():
    # TODO: Add pagination
    # TODO: Replace with actual database query
    user_entries = [entry for entry in entries.values() if entry['user'] == get_jwt_identity()]
    return jsonify(user_entries), 200

@app.route('/api/entries/<string:id>', methods=['GET'])
@jwt_required()
def get_single_entry(id):
    # TODO: Replace with actual database query
    entry = entries.get(id)
    if not entry or entry['user'] != get_jwt_identity():
        return jsonify({"error": "Entry not found"}), 404
    return jsonify(entry), 200

@app.route('/api/entries/<string:id>', methods=['PUT'])
@jwt_required()
def update_entry(id):
    # TODO: Replace with actual database query
    entry = entries.get(id)
    if not entry or entry['user'] != get_jwt_identity():
        return jsonify({"error": "Entry not found"}), 404
    
    title = request.json.get('title', entry['title'])
    content = request.json.get('content', entry['content'])
    
    entry['title'] = title
    entry['content'] = content
    entry['updatedAt'] = datetime.now(timezone.utc)
    
    return jsonify(entry), 200

@app.route('/api/entries/<string:id>', methods=['DELETE'])
@jwt_required()
def delete_entry(id):
    # TODO: Replace with actual database query
    entry = entries.get(id)
    if not entry or entry['user'] != get_jwt_identity():
        return jsonify({"error": "Entry not found"}), 404
    
    del entries[id]
    return '', 204

# Existing OpenAI demo endpoint
@app.route('/prompt', methods=['GET'])
def prompt_openai():
    prompt = "What is the capital of the moon?"
    
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": prompt
            }
        ]
    )
    
    completion_text = completion.choices[0].message.content.strip()
    tokens_used = completion.usage.total_tokens
    cost_estimate = tokens_used * 0.03 / 1000  # Assuming $0.03 per 1k tokens for gpt-4o-mini
    
    return jsonify({
        "completion": completion_text,
        "tokens_used": tokens_used,
        "cost_estimate": f"${cost_estimate:.4f}"
    })

if __name__ == '__main__':
    app.run(debug=True)
