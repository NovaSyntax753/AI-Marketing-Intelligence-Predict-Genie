import pandas as pd
from sqlalchemy.orm import Session
from models import MarketingData
from typing import Dict, List, Any


class AnalyticsEngine:
    """Analytics engine for marketing data analysis"""

    # =========================
    # Engagement Formula (Percentage)
    # =========================
    @staticmethod
    def calculate_engagement_score(
        like_count: int,
        comment_count: int,
        repost_count: int,
        follower_count: int
    ) -> float:
        """
        Engagement = (likes + 2*comments + 3*reposts) / followers * 100
        Returns percentage
        """
        return ((like_count + 2 * comment_count + 3 * repost_count) / max(follower_count, 1)) * 100

    # =========================
    # OVERALL ANALYTICS
    # =========================
    @staticmethod
    def get_analytics(db: Session) -> Dict[str, Any]:

        data = db.query(MarketingData).all()
        if not data:
            return {
                "total_posts": 0,
                "avg_engagement_score": 0.0,
                "content_type_stats": {},
                "time_of_day_stats": {},
                "top_performing_posts": []
            }

        # Build dataframe and calculate engagement dynamically
        df = pd.DataFrame([{
            "id": d.id,
            "follower_count": d.follower_count,
            "post_type": d.post_type,
            "created_at": d.created_at,
            "like_count": d.like_count,
            "comment_count": d.comment_count,
            "repost_count": d.repost_count,
            "hashtag_count": d.hashtag_count,
            "mention_count": d.mention_count,
            "engagement_score": AnalyticsEngine.calculate_engagement_score(
                d.like_count, d.comment_count, d.repost_count, d.follower_count
            )
        } for d in data])

        # Extract posting hour
        df["hour"] = pd.to_datetime(df["created_at"]).dt.hour

        total_posts = len(df)
        avg_engagement_score = round(df["engagement_score"].mean(), 2)

        # -------------------------
        # Content Type Stats
        # -------------------------
        content_type_stats = (
            df.groupby("post_type").agg({
                "engagement_score": "mean",
                "like_count": "mean",
                "comment_count": "mean",
                "repost_count": "mean"
            })
            .round(2)
            .to_dict("index")
        )

        # -------------------------
        # Time of Day Stats
        # -------------------------
        time_of_day_stats = (
            df.groupby("hour").agg({
                "engagement_score": "mean",
                "id": "count"
            })
            .rename(columns={"id": "post_count"})
            .round(2)
            .to_dict("index")
        )

        # -------------------------
        # Top Performing Posts
        # -------------------------
        top_posts = (
            df.nlargest(10, "engagement_score")[[
                "id", "post_type", "engagement_score", "like_count", "comment_count", "repost_count"
            ]]
            .to_dict("records")
        )

        return {
            "total_posts": total_posts,
            "avg_engagement_score": avg_engagement_score,
            "content_type_stats": content_type_stats,
            "time_of_day_stats": time_of_day_stats,
            "top_performing_posts": top_posts
        }

    # =========================
    # Post Type Analysis
    # =========================
    @staticmethod
    def get_post_type_analysis(db: Session) -> List[Dict[str, Any]]:

        data = db.query(MarketingData).all()
        if not data:
            return []

        df = pd.DataFrame([{
            "post_type": d.post_type,
            "engagement_score": AnalyticsEngine.calculate_engagement_score(
                d.like_count, d.comment_count, d.repost_count, d.follower_count
            ),
            "like_count": d.like_count,
            "comment_count": d.comment_count,
            "repost_count": d.repost_count
        } for d in data])

        return (
            df.groupby("post_type").agg({
                "engagement_score": "mean",
                "like_count": "mean",
                "comment_count": "mean",
                "repost_count": "mean"
            })
            .reset_index()
            .round(2)
            .to_dict("records")
        )

    # =========================
    # Time Analysis
    # =========================
    @staticmethod
    def get_time_analysis(db: Session) -> List[Dict[str, Any]]:

        data = db.query(MarketingData).all()
        if not data:
            return []

        df = pd.DataFrame([{
            "created_at": d.created_at,
            "engagement_score": AnalyticsEngine.calculate_engagement_score(
                d.like_count, d.comment_count, d.repost_count, d.follower_count
            )
        } for d in data])

        df["hour"] = pd.to_datetime(df["created_at"]).dt.hour

        return (
            df.groupby("hour")["engagement_score"]
            .mean()
            .reset_index()
            .round(2)
            .to_dict("records")
        )

    # =========================
    # Follower Analysis
    # =========================
    @staticmethod
    def get_follower_analysis(db: Session) -> Dict[str, Any]:

        data = db.query(MarketingData).all()
        if not data:
            return {}

        df = pd.DataFrame([{
            "follower_count": d.follower_count,
            "engagement_score": AnalyticsEngine.calculate_engagement_score(
                d.like_count, d.comment_count, d.repost_count, d.follower_count
            )
        } for d in data])

        return {
            "avg_follower_count": round(df["follower_count"].mean(), 2),
            "avg_engagement_score": round(df["engagement_score"].mean(), 2),
            "max_follower_count": int(df["follower_count"].max()),
            "min_follower_count": int(df["follower_count"].min())
        }