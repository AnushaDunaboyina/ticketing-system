import sqlite3
from pathlib import Path


def _db_file_path() -> Path:
    db_dir = Path(__file__).resolve().parents[2] / "data"
    db_dir.mkdir(parents=True, exist_ok=True)
    return db_dir / "ticketing.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(_db_file_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn
