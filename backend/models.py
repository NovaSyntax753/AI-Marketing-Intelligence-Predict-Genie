from sqlalchemy import Column, Integer, String, Float, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class MarketingData(Base):
    __tablename__ = "marketing_data"
    
    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, nullable=False)
    impressions = Column(Integer, nullable=False)
    likes = Column(Integer, nullable=False)
    comments = Column(Integer, nullable=False)
    shares = Column(Integer, nullable=False)
    post_type = Column(String, nullable=False)
    caption = Column(String, nullable=True)
    timestamp = Column(DateTime, nullable=False)
    engagement_rate = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "platform": self.platform,
            "impressions": self.impressions,
            "likes": self.likes,
            "comments": self.comments,
            "shares": self.shares,
            "post_type": self.post_type,
            "caption": self.caption,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "engagement_rate": self.engagement_rate,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
