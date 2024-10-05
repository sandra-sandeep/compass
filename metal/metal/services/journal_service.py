from datetime import datetime, timezone

# Mock database (replace with actual database in production)
entries = {}

def create_journal_entry(title, content, user):
    entry_id = str(len(entries) + 1)
    now = datetime.now(timezone.utc)
    entry = {
        'id': entry_id,
        'title': title,
        'content': content,
        'createdAt': now,
        'updatedAt': now,
        'user': user
    }
    entries[entry_id] = entry
    return entry

def get_user_entries(user):
    return [entry for entry in entries.values() if entry['user'] == user]

def get_journal_entry(entry_id, user):
    entry = entries.get(entry_id)
    if entry and entry['user'] == user:
        return entry
    return None

def update_journal_entry(entry_id, title, content, user):
    entry = entries.get(entry_id)
    if entry and entry['user'] == user:
        entry['title'] = title or entry['title']
        entry['content'] = content or entry['content']
        entry['updatedAt'] = datetime.now(timezone.utc)
        return entry
    return None

def delete_journal_entry(entry_id, user):
    entry = entries.get(entry_id)
    if entry and entry['user'] == user:
        del entries[entry_id]
        return True
    return False
