from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class MarketingDataInput(BaseModel):
    platform: str = Field(..., description="Social media platform")
    impressions: int = Field(..., ge=0, description="Number of impressions")
    likes: int = Field(..., ge=0, description="Number of likes")
    comments: int = Field(..., ge=0, description="Number of comments")
    shares: int = Field(..., ge=0, description="Number of shares")
    post_type: str = Field(..., description="Type of post")
    caption: Optional[str] = Field(None, description="Post caption")
    timestamp: datetime = Field(..., description="Post timestamp")
    
    @validator('platform')
    def validate_platform(cls, v):
        allowed_platforms = ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'youtube']
        if v.lower() not in allowed_platforms:
            raise ValueError(f'Platform must be one of {allowed_platforms}')
        return v.lower()
    
    @validator('post_type')
    def validate_post_type(cls, v):
        allowed_types = ['image', 'video', 'carousel', 'story', 'reel', 'text', 'link']
        if v.lower() not in allowed_types:
            raise ValueError(f'Post type must be one of {allowed_types}')
        return v.lower()

class MarketingDataResponse(BaseModel):
    id: int
    platform: str
    impressions: int
    likes: int
    comments: int
    shares: int
    post_type: str
    caption: Optional[str]
    timestamp: datetime
    engagement_rate: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

class PredictionInput(BaseModel):
    post_type: str
    posting_time: int = Field(..., ge=0, le=23, description="Hour of the day (0-23)")
    platform: str
    
    @validator('platform')
    def validate_platform(cls, v):
        allowed_platforms = ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'youtube']
        if v.lower() not in allowed_platforms:
            raise ValueError(f'Platform must be one of {allowed_platforms}')
        return v.lower()
    
    @validator('post_type')
    def validate_post_type(cls, v):
        allowed_types = ['image', 'video', 'carousel', 'story', 'reel', 'text', 'link']
        if v.lower() not in allowed_types:
            raise ValueError(f'Post type must be one of {allowed_types}')
        return v.lower()

class PredictionResponse(BaseModel):
    predicted_engagement: float
    post_type: str
    posting_time: int
    platform: str
    confidence_score: Optional[float] = None

class AnalyticsResponse(BaseModel):
    total_posts: int
    avg_engagement_rate: float
    platform_stats: dict
    content_type_stats: dict
    time_of_day_stats: dict
    top_performing_posts: list

class RecommendationResponse(BaseModel):
    best_posting_times: list
    best_content_types: list
    best_platforms: list
    caption_suggestions: list
    overall_insights: list
