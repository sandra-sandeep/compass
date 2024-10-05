from dotenv import load_dotenv
from flask import Flask
from flask_jwt_extended import JWTManager
from metal.config import Config

jwt = JWTManager()

def create_app():
    load_dotenv()
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)
    
    # Initialize JWTManager
    jwt.init_app(app)
    
    # Register blueprints (routes)
    from metal.routes.auth import auth_bp
    from metal.routes.journal import journal_bp
    from metal.routes.openai import openai_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(journal_bp, url_prefix='/api/entries')
    app.register_blueprint(openai_bp, url_prefix='/api/openai')
    
    return app