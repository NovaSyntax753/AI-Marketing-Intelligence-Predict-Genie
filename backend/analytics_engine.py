import pandas as pd
from sqlalchemy.orm import Session
from models import MarketingData
from typing import Dict, List, Any


class AnalyticsEngine:
    """Analytics engine for marketing data analysis"""

    @staticmethod
    def calculate_engagement_score(likes: int, comments: int, reposts: int) -> float:
        """Calculate engagement score"""
        return likes + comments + reposts

    @staticmethod
    def get_analytics(db: Session) -> Dict[str, Any]:
        """Get overall analytics"""
        data = db.query(MarketingData).all()
        if not data:
            return {
                "total_posts": 0,
                "avg_engagement_score": 0.0,
                "content_type_stats": {},
                "time_of_day_stats": {},
                "top_performing_posts": []
            }

        df = pd.DataFrame([{
            "id": d.id,
            "followers_count": d.followers_count,
            "post_type": d.post_type,
            "post_date": d.post_date,
            "likes": d.likes,
            "comments": d.comments,
            "reposts": d.reposts,
            "engagement_score": d.engagement_score
        } for d in data])

        df["hour"] = pd.to_datetime(df["post_date"]).dt.hour

        total_posts = len(df)
        avg_engagement_score = round(df["engagement_score"].mean(), 2)

        content_type_stats = df.groupby("post_type").agg({
            "engagement_score": "mean",
            "likes": "mean",
            "comments": "mean",
            "reposts": "mean"
        }).round(2).to_dict("index")

        time_of_day_stats = df.groupby("hour").agg({
            "engagement_score": "mean",
            "id": "count"
        }).rename(columns={"id": "post_count"}).round(2).to_dict("index")

        top_posts = df.nlargest(10, "engagement_score")[[
            "id",
            "post_type",
            "engagement_score",
            "likes",
            "comments",
            "reposts"
        ]].to_dict("records")

        return {
            "total_posts": total_posts,
            "avg_engagement_score": avg_engagement_score,
            "content_type_stats": content_type_stats,
            "time_of_day_stats": time_of_day_stats,
            "top_performing_posts": top_posts
        }

    @staticmethod
    def get_post_type_analysis(db: Session) -> List[Dict[str, Any]]:
        """Analyze performance by content type (matches /analytics/post-type route)"""
        data = db.query(MarketingData).all()
        if not data:
            return []

        df = pd.DataFrame([{
            "post_type": d.post_type,
            "likes": d.likes,
            "comments": d.comments,
            "reposts": d.reposts,
            "engagement_score": d.engagement_score
        } for d in data])

        analysis = df.groupby("post_type").agg({
            "engagement_score": "mean",
            "likes": "mean",
            "comments": "mean",
            "reposts": "mean"
        }).reset_index().round(2).to_dict("records")

        return analysis

    @staticmethod
    def get_time_analysis(db: Session) -> List[Dict[str, Any]]:
        """Analyze engagement by posting hour (matches /analytics/time-analysis route)"""
        data = db.query(MarketingData).all()
        if not data:
            return []

        df = pd.DataFrame([{
            "post_date": d.post_date,
            "engagement_score": d.engagement_score
        } for d in data])

        df["hour"] = pd.to_datetime(df["post_date"]).dt.hour

        analysis = df.groupby("hour").agg({
            "engagement_score": "mean"
        }).reset_index().round(2).to_dict("records")

        return analysis

    @staticmethod
    def get_follower_analysis(db: Session) -> Dict[str, Any]:
        """Example: simple follower count analysis"""
        data = db.query(MarketingData).all()
        if not data:
            return {}

        df = pd.DataFrame([{
            "followers_count": d.followers_count,
            "engagement_score": d.engagement_score
        } for d in data])

        return {
            "avg_followers": round(df["followers_count"].mean(), 2),
            "avg_engagement_score": round(df["engagement_score"].mean(), 2)
        }