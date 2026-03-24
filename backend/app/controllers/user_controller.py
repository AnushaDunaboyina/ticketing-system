from app.repositories.user_repository import UserRepository

repo = UserRepository()

def get_all():
    return repo.get_all()

def get(user_id):
    return repo.get_by_id(user_id)

def create(**data):
    repo.create(data)
    return {"message": "User created successfully"}

def update(user_id, **data):
    user = get(user_id)
    if not user:
        raise ValueError(f"User {user_id} not found")
    repo.update(user_id, data)
    return {"message": "User updated successfully"}

def delete(user_id):
    user = get(user_id)
    if not user:
        raise ValueError(f"User {user_id} not found")
    repo.delete(user_id)
    return True
