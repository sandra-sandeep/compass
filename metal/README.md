# Metal - Compass Journal Backend

Metal is the backend server for Compass, a journaling application. It provides API endpoints for user authentication and journal entry management.

## Prerequisites

- Python 3.10 or higher (probably would work on earlier versions, but I've only tested on 3.10)
- uv (Python package installer and virtual environment manager)

## Setup

1. Install Python 3.10+:
   - On macOS with Homebrew: `brew install python@3.10`
   - On Ubuntu: `sudo apt-get install python3.10`
   - For other systems, visit [python.org](https://www.python.org/downloads/)

2. Install uv:
   ```
   pip install uv
   ```

3. Set up environment variables:
   Create a `.env` file in the project root and add:
   ```
   JWT_SECRET_KEY=your_secret_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Running the App

1. Start the Flask server:
   ```
   uv run metal/app.py
   ```

The server will start on `http://localhost:5000`.

## Running Tests

To run the API tests:

1. Ensure the Flask server is running.
2. Run the test script:
   ```
   uv run tests/test_api.py
   ```

## API Endpoints

- Journal Entries:
  - POST `/api/entries`: Create a new entry
  - GET `/api/entries`: Get all entries for the authenticated user
  - GET `/api/entries/<id>`: Get a specific entry
  - PUT `/api/entries/<id>`: Update an entry
  - DELETE `/api/entries/<id>`: Delete an entry

- OpenAI Integration:
  - GET `/prompt`: Send a prompt to OpenAI (demo endpoint)
