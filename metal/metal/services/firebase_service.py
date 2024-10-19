import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime, timezone
from metal.exceptions import *

DATABASE_NAME = "(default)"

class FirebaseService:
    
    def __init__(self, app=None):
        self.app = None
        self.db = None
        self.auth = None
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        """
        Initialize the Firebase service for both Firestore and Authentication.
        """
        try:
            if not firebase_admin._apps:
                cred = credentials.Certificate(app.config['GOOGLE_APPLICATION_CREDENTIALS'])
                self.app = firebase_admin.initialize_app(cred)
            else:
                self.app = firebase_admin.get_app()
            
            self.db = firestore.client()
            self.auth = auth.Client(self.app)
        except Exception as e:
            raise InternalError(str(e))

    def get_user(self, user_id):
        """
        Get a user by their ID.
        """
        try:
            return auth.get_user(user_id)
        except auth.UserNotFoundError:
            raise UserNotFoundError()
        except Exception as e:
            raise InternalError(str(e))
    
    def verify_id_token(self, id_token):
        """
        Verify an ID token.
        """
        try:
            decoded_token = auth.verify_id_token(id_token)
            return decoded_token
        except auth.ExpiredIdTokenError:
            raise ExpiredIdTokenError()
        except auth.InvalidIdTokenError:
            raise InvalidIdTokenError()
        except Exception as e:
            raise InternalError(str(e))

    def create_journal_entry(self, title, content, user_id):
        """
        Create a new journal entry for the given user.
        """
        try:
            user_ref = self.db.collection(DATABASE_NAME).document(user_id)
            entries_ref = user_ref.collection('journal_entries')
            entry_id = str(entries_ref.document().id)
            now = datetime.now(timezone.utc)
            entry_data = {
                'id': entry_id,
                'title': title,
                'content': content,
                'createdAt': now,
                'updatedAt': now
            }
            entries_ref.document(entry_id).set(entry_data)
            return entry_data
        except Exception as e:
            raise DatabaseError(f"Failed to create journal entry: {str(e)}", 500)

    def get_user_entries(self, user_id):
        """
        Get all journal entries for a user.
        """
        try:
            user_ref = self.db.collection(DATABASE_NAME).document(user_id)
            entries_ref = user_ref.collection('journal_entries')
            return [entry.to_dict() for entry in entries_ref.stream()]
        except Exception as e:
            raise DatabaseError(f"Failed to retrieve user entries: {str(e)}", 500)

    def get_journal_entry(self, user_id, entry_id):
        """
        Get a specific journal entry by its ID for a user.
        """
        try:
            entry_ref = self.db.collection(DATABASE_NAME).document(user_id).collection('journal_entries').document(entry_id)
            entry = entry_ref.get()
            return entry.to_dict() if entry.exists else None
        except Exception as e:
            raise DatabaseError(f"Failed to retrieve journal entry: {str(e)}", 500)

    def update_journal_entry(self, user_id, entry_id, title, content):
        """
        Update a specific journal entry by its ID for a user.
        """
        try:
            entry_ref = self.db.collection(DATABASE_NAME).document(user_id).collection('journal_entries').document(entry_id)
            now = datetime.now(timezone.utc)
            entry_ref.update({
                'title': title,
                'content': content,
                'updatedAt': now
            })
            return self.get_journal_entry(user_id, entry_id)
        except Exception as e:
            raise DatabaseError(f"Failed to update journal entry: {str(e)}", 500)

    def delete_journal_entry(self, user_id, entry_id):
        """
        Delete a specific journal entry by its ID for a user.
        """
        try:
            entry_ref = self.db.collection(DATABASE_NAME).document(user_id).collection('journal_entries').document(entry_id)
            entry_ref.delete()
        except Exception as e:
            raise DatabaseError(f"Failed to delete journal entry: {str(e)}", 500)
