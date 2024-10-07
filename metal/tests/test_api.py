import requests

BASE_URL = "https://127.0.0.1:5000"

def test_api():
    # Test user registration
    print("Testing user registration...")
    register_response = requests.post(f"{BASE_URL}/api/auth/register", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert register_response.status_code == 201, f"Registration failed: {register_response.text}"
    register_data = register_response.json()
    assert "userId" in register_data and "token" in register_data, "Registration response missing userId or token"
    user_id = register_data["userId"]
    token = register_data["token"]
    assert user_id == "1", f"Expected user_id to be '1', but got '{user_id}'"
    print("User registration successful.")

    # Test user login
    print("Testing user login...")
    login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert login_response.status_code == 200, f"Login failed: {login_response.text}"
    login_data = login_response.json()
    assert "userId" in login_data and "token" in login_data, "Login response missing userId or token"
    token = login_data["token"]  # Update token with the new one from login
    print("User login successful.")

    # Test login with incorrect password
    print("Testing login with incorrect password...")
    incorrect_password_response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "test@example.com",
        "password": "wrongpassword"
    })
    assert incorrect_password_response.status_code == 401, f"Login with incorrect password should fail: {incorrect_password_response.text}"
    print("Login with incorrect password test successful.")

    # Test login with nonexistent email
    print("Testing login with nonexistent email...")
    nonexistent_email_response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "nonexistent@example.com",
        "password": "password123"
    })
    assert nonexistent_email_response.status_code == 401, f"Login with nonexistent email should fail: {nonexistent_email_response.text}"
    print("Login with nonexistent email test successful.")

    # Test creating an entry
    print("Testing create entry...")
    create_entry_response = requests.post(
        f"{BASE_URL}/api/entries",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Test Entry",
            "content": "This is a test entry content."
        }
    )
    assert create_entry_response.status_code == 201, f"Create entry failed: {create_entry_response.text}"
    entry_data = create_entry_response.json()
    assert "id" in entry_data, "Create entry response missing id"
    entry_id = entry_data["id"]
    print("Create entry successful.")

    # Test getting all entries
    print("Testing get all entries...")
    get_entries_response = requests.get(
        f"{BASE_URL}/api/entries",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_entries_response.status_code == 200, f"Get entries failed: {get_entries_response.text}"
    entries = get_entries_response.json()
    assert isinstance(entries, list) and len(entries) > 0, "Get entries response should be a non-empty list"
    print("Get all entries successful.")

    # Test getting a single entry
    print("Testing get single entry...")
    get_entry_response = requests.get(
        f"{BASE_URL}/api/entries/{entry_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_entry_response.status_code == 200, f"Get single entry failed: {get_entry_response.text}"
    single_entry = get_entry_response.json()
    assert single_entry["id"] == entry_id, "Retrieved entry id doesn't match"
    print("Get single entry successful.")

    # Test updating an entry
    print("Testing update entry...")
    update_entry_response = requests.put(
        f"{BASE_URL}/api/entries/{entry_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Updated Test Entry",
            "content": "This is the updated content."
        }
    )
    assert update_entry_response.status_code == 200, f"Update entry failed: {update_entry_response.text}"
    updated_entry = update_entry_response.json()
    assert updated_entry["title"] == "Updated Test Entry", "Entry title not updated"
    print("Update entry successful.")

    # Test deleting an entry
    print("Testing delete entry...")
    delete_entry_response = requests.delete(
        f"{BASE_URL}/api/entries/{entry_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert delete_entry_response.status_code == 204, f"Delete entry failed: {delete_entry_response.text}"
    print("Delete entry successful.")

    print("All tests completed successfully!")

if __name__ == "__main__":
    test_api()