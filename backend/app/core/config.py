from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./geomangan.db")
ENV = os.getenv("ENVIRONMENT", "development")