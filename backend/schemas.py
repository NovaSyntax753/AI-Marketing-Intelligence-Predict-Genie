from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict
from datetime import datetime


# =========================
# DATA INGESTION SCHEMA
# =========================
class MarketingDataInput(BaseModel):
    name: str
    follower_count: int = Field(..., ge=0)
    post_type: str
    like_count: int = Field(..., ge=0)
    comment_count: int = Field(..., ge=0)
    repost_count: int = Field(..., ge=0)
    hashtag_count: int = Field(..., ge=0)
    mention_count: int = Field(..., ge=0)
    CTA_used: Optional[str] = "NO_CTA"

    @validator("post_type")
    def validate_post_type(cls, v):
        allowed_types = ["image", "video", "reel", "text", "carousel"]
        if v.lower() not in allowed_types:
            raise ValueError(f"post_type must be one of {allowed_types}")
        return v.lower()


# =========================
# DATABASE RESPONSE
# =========================
class MarketingDataResponse(BaseModel):
    id: int
    name: str
    follower_count: int
    post_type: str
    like_count: int
    comment_count: int
    repost_count: int
    hashtag_count: int
    mention_count: int
    CTA_used: Optional[str]
    engagement_score: Optional[float]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


# =========================
# PREDICTION INPUT
# =========================
class PredictionInput(BaseModel):
    follower_count: int = Field(..., ge=0)
    post_type: str
    # like_count: int = Field(..., ge=0)
    # comment_count: int = Field(..., ge=0)
    # repost_count: int = Field(..., ge=0)
    hashtag_count: int = Field(..., ge=0)
    mention_count: int = Field(..., ge=0)
    cta_used: str

    @validator("post_type")
    def validate_post_type(cls, v):
        allowed_types = ["image", "video", "reel", "text", "carousel"]
        if v.lower() not in allowed_types:
            raise ValueError(f"post_type must be one of {allowed_types}")
        return v.lower()


# =========================
# PREDICTION RESPONSE ✅ FIXED
# =========================
class PredictionResponse(BaseModel):
    success: bool
    predicted_engagement_score: float
    confidence_score: float


# =========================
# ANALYTICS RESPONSE (OPTIONAL)
# =========================
class AnalyticsResponse(BaseModel):
    total_posts: int
    avg_engagement_score: float
    content_type_stats: Dict
    time_of_day_stats: Dict
    top_performing_posts: List[Dict]


# =========================
# RECOMMENDATIONS RESPONSE
# =========================
class RecommendationResponse(BaseModel):
    best_posting_times: List[Dict]
    best_content_types: List[Dict]
    best_cta: List[Dict]
    caption_suggestions: List[Dict]
    overall_insights: List[str]


# =========================
# HELPER FUNCTION
# =========================
def calculate_engagement(data: MarketingDataInput) -> float:
    return round(
        (
            data.like_count +
            2 * data.comment_count +
            3 * data.repost_count
        ) / max(data.follower_count, 1) * 100,
        2
    )