from flask import Blueprint, request, jsonify
from metal import firebase_service
from metal.exceptions import *

journal_bp = Blueprint('journal', __name__)

def get_user_id_from_token():
    """
    Get the user ID from the Authorization header.
    """
    id_token = request.headers.get('Authorization')
    if not id_token:
        raise InvalidIdTokenError("No ID token provided")
    
    decoded_token = firebase_service.verify_id_token(id_token)
    return decoded_token['uid']

# Journal Entry Endpoints

@journal_bp.route('/', methods=['POST'])
def create_entry():
    user_id = get_user_id_from_token()
    title = request.json.get('title')
    content = request.json.get('content')
    
    if not title or not content:
        raise InvalidArgumentError("Title and content are required")
    
    entry = firebase_service.create_journal_entry(title, content, user_id)
    return jsonify(entry), 201

@journal_bp.route('/', methods=['GET'])
def get_all_entries():
    user_id = get_user_id_from_token()
    user_entries = firebase_service.get_user_entries(user_id)
    return jsonify(user_entries), 200

@journal_bp.route('/<string:entry_id>', methods=['GET'])
def get_single_entry(entry_id):
    user_id = get_user_id_from_token()
    entry = firebase_service.get_journal_entry(user_id, entry_id)
    if not entry:
        raise InvalidArgumentError("Entry not found")
    return jsonify(entry), 200

@journal_bp.route('/<string:entry_id>', methods=['PUT'])
def update_entry(entry_id):
    user_id = get_user_id_from_token()
    title = request.json.get('title')
    content = request.json.get('content')
    
    if not title or not content:
        raise InvalidArgumentError("Title and content are required")
    
    entry = firebase_service.update_journal_entry(user_id, entry_id, title, content)
    if not entry:
        raise InvalidArgumentError("Entry not found")
    return jsonify(entry), 200

@journal_bp.route('/<string:entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    user_id = get_user_id_from_token()
    firebase_service.delete_journal_entry(user_id, entry_id)
    return '', 204

@journal_bp.errorhandler(FirebaseError)
def handle_firebase_error(error):
    response = jsonify({"error": error.message})
    response.status_code = error.status_code
    return response
