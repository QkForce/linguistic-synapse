from utils.db import create_tables, db_connection, seed_database


def init_db():
    with db_connection() as conn:
        create_tables(conn)
        seed_database(conn)


if __name__ == "__main__":
    init_db()
