from app.db.base import Base, engine
import app.db.models

def init_db():
    Base.metadata.create_all(bind=engine)
