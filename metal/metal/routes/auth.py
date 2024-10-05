from flask import Blueprint, request, jsonify
from metal.services.auth_service import register_user, login_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    response, status = register_user(email, password)
    return jsonify(response), status

@auth_bp.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    response, status = login_user(email, password)
    return jsonify(response), status