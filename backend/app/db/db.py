import os

import mysql.connector

def get_db_config():
    return {
        "host": os.getenv("DB_HOST", "localhost"),
        "user": os.getenv("DB_USER", "root"),
        "password": os.getenv("DB_PASSWORD", ""),
        "database": os.getenv("DB_NAME", "production_support_db"),
    }

def ensure_database_exists():
    config = get_db_config()
    server_conn = mysql.connector.connect(
        host=config["host"],
        user=config["user"],
        password=config["password"],
    )
    cursor = server_conn.cursor()
    db_name = config["database"].replace("`", "``")
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}`")
    server_conn.commit()
    cursor.close()
    server_conn.close()

def get_connection():
    config = get_db_config()
    ensure_database_exists()
    return mysql.connector.connect(
        host=config["host"],
        user=config["user"],
        password=config["password"],
        database=config["database"],
    )
