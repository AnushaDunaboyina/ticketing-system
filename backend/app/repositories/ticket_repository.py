from app.db.db import get_connection

class TicketRepository:

    def get_all(self):
        conn = get_connection()
        cursor = conn.cursor()

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
        tickets = [dict(row) for row in cursor.fetchall()]

        conn.close()
        return tickets

    def get_by_id(self, ticket_id):
        conn = get_connection()
        cursor = conn.cursor()

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
            WHERE id=?
        """, (ticket_id,))
        ticket = cursor.fetchone()

        conn.close()
        return dict(ticket) if ticket else None

    def create(self, data):
        conn = get_connection()
        cursor = conn.cursor()

        sql = """
        INSERT INTO tickets (title, description, status, priority, assigned_to, created_by)
        VALUES (?, ?, ?, ?, ?, ?)
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
        SET title=?, description=?, status=?, priority=?,
            assigned_to=?, created_by=?
        WHERE id=?
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

        cursor.execute("DELETE FROM tickets WHERE id=?", (ticket_id,))
        conn.commit()
        conn.close()
