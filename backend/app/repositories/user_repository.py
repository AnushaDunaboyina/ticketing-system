from app.db.db import get_connection

class UserRepository:

    def get_all(self):
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users")
        data = [dict(row) for row in cursor.fetchall()]

        conn.close()
        return data

    def get_by_id(self, user_id):
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users WHERE id=?", (user_id,))
        data = cursor.fetchone()

        conn.close()
        return dict(data) if data else None

    def create(self, data):
        conn = get_connection()
        cursor = conn.cursor()

        sql = "INSERT INTO users (name, email, role) VALUES (?, ?, ?)"

        cursor.execute(sql, (
            data["name"],
            data["email"],
            data["role"]
        ))

        conn.commit()
        conn.close()

    def update(self, user_id, data):
        conn = get_connection()
        cursor = conn.cursor()

        sql = """
        UPDATE users
        SET name=?, email=?, role=?
        WHERE id=?
        """

        cursor.execute(sql, (
            data["name"],
            data["email"],
            data["role"],
            user_id
        ))

        conn.commit()
        conn.close()

    def delete(self, user_id):
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM users WHERE id=?", (user_id,))
        conn.commit()
        conn.close()
