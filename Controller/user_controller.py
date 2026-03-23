from models.user import User

users = []

def create(name="", email="", role="user"):
    user = User(name=name, email=email, role=role)
    users.append(user)
    return user

def get(user_id):
    for user in users:
        if user.id == user_id:
            return user
    return None

def get_all():
    return users.copy()

def update(user_id, name=None, email=None, role=None):
    user = get(user_id)
    if user:
        if name is not None:
            user.name = name
        if email is not None:
            user.email = email
        if role is not None:
            user.role = role
        return user
    return None

def delete(user_id):
    user = get(user_id)
    if user:
        users.remove(user)
        return True
    return False