#!/usr/bin/env python3
"""
Database initialization script
Creates the users and tickets tables in MySQL
"""
import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend'))

import mysql.connector
from app.db.db import get_connection

def create_tables():
    """Create the database tables"""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        print("=" * 60)
        print("Creating database tables...")
        print("=" * 60)
        
        # Create users table
        create_users_table = """
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
        cursor.execute(create_users_table)
        print("✓ Users table created")
        
        # Create tickets table
        create_tickets_table = """
        CREATE TABLE IF NOT EXISTS tickets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status INT DEFAULT 1 COMMENT '1=Open, 2=In Progress, 3=Resolved',
            priority INT DEFAULT 1 COMMENT '1=Low, 2=Medium, 3=High',
            assigned_to INT,
            created_by INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
        )
        """
        cursor.execute(create_tickets_table)
        print("✓ Tickets table created")
        
        conn.commit()
        conn.close()
        
        print("\n" + "=" * 60)
        print("✓ Database initialized successfully!")
        print("=" * 60)
        
    except mysql.connector.Error as err:
        if err.errno == 1050:
            print("✓ Tables already exist")
        else:
            print(f"✗ Error: {err}")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    create_tables()
