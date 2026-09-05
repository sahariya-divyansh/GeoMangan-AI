from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import DATABASE_URL

db_url = DATABASE_URL

if db_url.startswith("postgresql"):
    try:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            pass
    except Exception:
        db_url = "sqlite:///./geomangan.db"
        engine = create_engine(db_url, connect_args={"check_same_thread": False})
elif db_url.startswith("sqlite"):
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
else:
    engine = create_engine(db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
