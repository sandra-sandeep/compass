from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from metal.config import Config
from metal.services.firebase_service import FirebaseService

firebase_service = FirebaseService()

def create_app():
    load_dotenv()
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)

    # Initialize CORS
    CORS(app, resources={r"/api/*": {"origins": [
        "https://localhost:3000", 
        "https://127.0.0.1:3000",
        "https://compassletters.com:3000"
    ]}})
    
    # Initialize FirebaseService
    firebase_service.init_app(app)
    
    # Register blueprints (routes)
    from metal.routes.journal import journal_bp
    from metal.routes.openai import openai_bp

    app.register_blueprint(journal_bp, url_prefix='/api/entries')
    app.register_blueprint(openai_bp, url_prefix='/api/openai')
    
    return app
