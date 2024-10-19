import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev_secret_key')
    DEBUG = True

    # Environment variables
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    OPENAI_PROJECT_ID = os.getenv('OPENAI_PROJECT_ID')
    OPENAI_ORG_ID = os.getenv('OPENAI_ORG_ID')
    GOOGLE_APPLICATION_CREDENTIALS = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
