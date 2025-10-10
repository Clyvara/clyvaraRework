from sqlalchemy import create_engine, Column, String, DateTime, JSON, UUID, Integer, Boolean, DECIMAL, Text
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import INET
from sqlalchemy.sql import func
import os
from dotenv import load_dotenv

load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/postgres")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency for database sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# User Data Schema Models
class ChatMessage(Base):
    __tablename__ = "chat_messages"
    __table_args__ = {'schema': 'user_data'}
    
    id = Column(UUID, primary_key=True, server_default=func.gen_random_uuid())
    session_id = Column(String)
    message_type = Column(String)
    message_content = Column(JSON)
    timestamp = Column(DateTime, server_default=func.now())
    thread_id = Column(String)
    user_id = Column(UUID)  # Link to Supabase user
    response_time_ms = Column(Integer)
    message_length = Column(Integer)

class UserInteraction(Base):
    __tablename__ = "user_interactions"
    __table_args__ = {'schema': 'user_data'}
    
    id = Column(UUID, primary_key=True, server_default=func.gen_random_uuid())
    session_id = Column(String)
    interaction_type = Column(String)
    interaction_data = Column(JSON)
    timestamp = Column(DateTime, server_default=func.now())
    user_id = Column(UUID)  # Link to Supabase user
    page_url = Column(Text)
    device_info = Column(JSON)

class UserSession(Base):
    __tablename__ = "user_session"
    __table_args__ = {'schema': 'user_data'}
    
    id = Column(UUID, primary_key=True, server_default=func.gen_random_uuid())
    session_id = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    last_activity = Column(DateTime)
    is_active = Column(Boolean, default=True)
    user_id = Column(UUID)  # Link to Supabase user
    ip_address = Column(INET)
    user_agent = Column(Text)
    session_duration = Column(Integer)

# Dashboard Schema Models
class DashboardLayout(Base):
    __tablename__ = "dashboard_layouts"
    __table_args__ = {'schema': 'dashboard'}
    
    id = Column(UUID, primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(UUID, nullable=False)
    layout_name = Column(String(100), nullable=False)
    layout_config = Column(JSON, nullable=False)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now())

class Widget(Base):
    __tablename__ = "widgets"
    __table_args__ = {'schema': 'dashboard'}
    
    id = Column(UUID, primary_key=True, server_default=func.gen_random_uuid())
    widget_type = Column(String(50), nullable=False)
    widget_name = Column(String(100), nullable=False)
    widget_config = Column(JSON, nullable=False)
    is_system = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

class UserWidget(Base):
    __tablename__ = "user_widgets"
    __table_args__ = {'schema': 'dashboard'}
    
    id = Column(UUID, primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(UUID, nullable=False)
    dashboard_layout_id = Column(UUID)
    widget_id = Column(UUID)
    widget_position = Column(JSON, nullable=False)
    widget_settings = Column(JSON)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now())

class UserPreference(Base):
    __tablename__ = "user_preferences"
    __table_args__ = {'schema': 'dashboard'}
    
    id = Column(UUID, primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(UUID, nullable=False, unique=True)
    theme = Column(String(20), default='light')
    timezone = Column(String(50), default='UTC')
    date_format = Column(String(20), default='MM/DD/YYYY')
    dashboard_settings = Column(JSON)
    notification_settings = Column(JSON)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now())

class AnalyticsData(Base):
    __tablename__ = "analytics_data"
    __table_args__ = {'schema': 'dashboard'}
    
    id = Column(UUID, primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(UUID)
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(DECIMAL(15, 4), nullable=False)
    metric_unit = Column(String(20))
    metadata_json = Column(JSON)
    recorded_at = Column(DateTime, server_default=func.now())

# Test database connection
def test_connection():
    try:
        with engine.connect() as connection:
            from sqlalchemy import text
            result = connection.execute(text("SELECT 1"))
            print("Database connection successful!")
            return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

if __name__ == "__main__":
    test_connection()
