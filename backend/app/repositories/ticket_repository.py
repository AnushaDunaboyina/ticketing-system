from app.db.db import get_connection

class TicketRepository:

    def get_all(self):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                title,
                description,
                status,
                priority,
                assigned_to,
                created_by,
                assigned_to AS assignee,
                created_by AS reporter,
                created_at,
                updated_at
            FROM tickets
        """)
        tickets = cursor.fetchall()

        conn.close()
        return tickets

    def get_by_id(self, ticket_id):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                title,
                description,
                status,
                priority,
                assigned_to,
                created_by,
                assigned_to AS assignee,
                created_by AS reporter,
                created_at,
                updated_at
            FROM tickets
            WHERE id=%s
        """, (ticket_id,))
        ticket = cursor.fetchone()

        conn.close()
        return ticket

    def create(self, data):
        conn = get_connection()
        cursor = conn.cursor()

        sql = """
        INSERT INTO tickets (title, description, status, priority, assigned_to, created_by)
        VALUES (%s, %s, %s, %s, %s, %s)
        """

        cursor.execute(sql, (
            data["title"],
            data["description"],
            data["status"],
            data["priority"],
            data["assignee"],
            data["reporter"]
        ))

        conn.commit()
        conn.close()

    def update(self, ticket_id, data):
        conn = get_connection()
        cursor = conn.cursor()

        sql = """
        UPDATE tickets
        SET title=%s, description=%s, status=%s, priority=%s,
            assigned_to=%s, created_by=%s
        WHERE id=%s
        """

        cursor.execute(sql, (
            data["title"],
            data["description"],
            data["status"],
            data["priority"],
            data["assignee"],
            data["reporter"],
            ticket_id
        ))

        conn.commit()
        conn.close()

    def delete(self, ticket_id):
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM tickets WHERE id=%s", (ticket_id,))
        conn.commit()
        conn.close()
