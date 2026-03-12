from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime


# DATA INGESTION SCHEMA
class MarketingDataInput(BaseModel):
    user_id: int
    Followers_count: int = Field(..., ge=0)
    Post_ID: int
    Post_Date: datetime
    Post_type: str
    Likes: int = Field(..., ge=0)
    Comments: int = Field(..., ge=0)
    Reposts: int = Field(..., ge=0)
    Engagement_score: Optional[float]

    @validator("Post_type")
    def validate_post_type(cls, v):
        allowed_types = ["image", "video", "reel", "text"]
        if v.lower() not in allowed_types:
            raise ValueError(f"Post_type must be one of {allowed_types}")
        return v.lower()


# DATABASE RESPONSE SCHEMA
class MarketingDataResponse(BaseModel):
    id: int
    user_id: int
    Followers_count: int
    Post_ID: int
    Post_Date: datetime
    Post_type: str
    Likes: int
    Comments: int
    Reposts: int
    Engagement_score: Optional[float]

    class Config:
        from_attributes = True


# PREDICTION INPUT
class PredictionInput(BaseModel):
    Followers_count: int = Field(..., ge=0)
    Post_type: str
    Likes: int = Field(..., ge=0)
    Comments: int = Field(..., ge=0)
    Reposts: int = Field(..., ge=0)

    @validator("Post_type")
    def validate_post_type(cls, v):
        allowed_types = ["image", "video", "reel", "text"]
        if v.lower() not in allowed_types:
            raise ValueError(f"Post_type must be one of {allowed_types}")
        return v.lower()


# PREDICTION RESPONSE
class PredictionResponse(BaseModel):
    predicted_engagement: float
    Followers_count: int
    Post_type: str
    Likes: int
    Comments: int
    Reposts: int
    confidence_score: Optional[float] = None


# ANALYTICS RESPONSE
class AnalyticsResponse(BaseModel):
    total_posts: int
    avg_engagement_score: float
    post_type_stats: dict
    follower_stats: dict
    engagement_distribution: dict
    top_posts: List[dict]


# RECOMMENDATIONS
class RecommendationResponse(BaseModel):
    best_post_types: List[str]
    best_follower_ranges: List[str]
    engagement_tips: List[str]
    overall_insights: List[str]

