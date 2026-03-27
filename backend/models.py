from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()


class MarketingData(Base):
    __tablename__ = "marketing_data"

    id = Column(Integer, primary_key=True, index=True)

    # ✅ Basic Info
    name = Column(String, nullable=False)
    follower_count = Column(Integer, nullable=False)

    # ✅ Post Info
    post_type = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # ✅ Engagement Metrics
    like_count = Column(Integer, nullable=False)
    comment_count = Column(Integer, nullable=False)
    repost_count = Column(Integer, nullable=False)

    # ✅ Extra Features (IMPORTANT for ML)
    hashtag_count = Column(Integer, nullable=False, default=0)
    mention_count = Column(Integer, nullable=False, default=0)

    # 🔥 FIX: default value for CTA (avoid NULL issues in ML)
    CTA_used = Column(String, nullable=False, default="no_cta")

    # ✅ Target Variable
    engagement_score = Column(Float, nullable=True)

    # =========================
    # HELPER METHOD
    # =========================
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "follower_count": self.follower_count,
            "post_type": self.post_type,
            "like_count": self.like_count,
            "comment_count": self.comment_count,
            "repost_count": self.repost_count,
            "hashtag_count": self.hashtag_count,
            "mention_count": self.mention_count,
            "CTA_used": self.CTA_used,
            "engagement_score": self.engagement_score,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }