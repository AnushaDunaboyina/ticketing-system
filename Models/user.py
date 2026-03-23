class User:
    _id_counter = 1

    def __init__(self, name="", email="", role="user"):
        self.id = User._id_counter
        User._id_counter += 1
        self.name = name
        self.email = email
        self.role = role