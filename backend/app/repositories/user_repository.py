from app.db.db import get_connection

class UserRepository:

    def get_all(self):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users")
        data = cursor.fetchall()

        conn.close()
        return data

    def get_by_id(self, user_id):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
        data = cursor.fetchone()

        conn.close()
        return data

    def create(self, data):
        conn = get_connection()
        cursor = conn.cursor()

        sql = "INSERT INTO users (name, email, role) VALUES (%s, %s, %s)"

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
        SET name=%s, email=%s, role=%s
        WHERE id=%s
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

        cursor.execute("DELETE FROM users WHERE id=%s", (user_id,))
        conn.commit()
        conn.close()
