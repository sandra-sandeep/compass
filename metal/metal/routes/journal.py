from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from metal.services.journal_service import (
    create_journal_entry,
    get_user_entries,
    get_journal_entry,
    update_journal_entry,
    delete_journal_entry
)

journal_bp = Blueprint('journal', __name__)

# Journal Entry Endpoints

@journal_bp.route('/', methods=['POST'])
@jwt_required()
def create_entry():
    title = request.json.get('title', None)
    content = request.json.get('content', None)
    user = get_jwt_identity()
    
    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400
    
    entry = create_journal_entry(title, content, user)
    return jsonify(entry), 201

@journal_bp.route('/', methods=['GET'])
@jwt_required()
def get_all_entries():
    user = get_jwt_identity()
    user_entries = get_user_entries(user)
    return jsonify(user_entries), 200

@journal_bp.route('/<string:id>/', methods=['GET'])
@jwt_required()
def get_single_entry(id):
    user = get_jwt_identity()
    entry = get_journal_entry(id, user)
    if not entry:
        return jsonify({"error": "Entry not found"}), 404
    return jsonify(entry), 200

@journal_bp.route('/<string:id>/', methods=['PUT'])
@jwt_required()
def update_entry(id):
    title = request.json.get('title', None)
    content = request.json.get('content', None)
    user = get_jwt_identity()
    
    entry = update_journal_entry(id, title, content, user)
    if not entry:
        return jsonify({"error": "Entry not found"}), 404
    return jsonify(entry), 200

@journal_bp.route('/<string:id>/', methods=['DELETE'])
@jwt_required()
def delete_entry(id):
    user = get_jwt_identity()
    success = delete_journal_entry(id, user)
    if not success:
        return jsonify({"error": "Entry not found"}), 404
    return '', 204