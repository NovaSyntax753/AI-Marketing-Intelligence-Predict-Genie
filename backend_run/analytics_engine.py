from sqlalchemy import cast, func, Integer
from sqlalchemy.orm import Session
from models import MarketingData
from typing import Dict, List, Any, Optional


class AnalyticsEngine:
    """Analytics engine for marketing data analysis"""

    @staticmethod
    def calculate_engagement_score(likes: int, comments: int, reposts: int) -> float:
        """Calculate engagement score"""
        return likes + comments + reposts

    @staticmethod
    def _apply_record_filter(query, record_ids: Optional[List[int]] = None):
        if record_ids is not None:
            if not record_ids:
                return None
            return query.filter(MarketingData.id.in_(record_ids))
        return query

    @staticmethod
    def _hour_expression(db: Session):
        dialect_name = db.get_bind().dialect.name if db.get_bind() is not None else ""
        if dialect_name == "sqlite":
            return cast(func.strftime("%H", MarketingData.post_date), Integer)
        return cast(func.date_part("hour", MarketingData.post_date), Integer)

    @staticmethod
    def _get_data(db: Session, record_ids: Optional[List[int]] = None) -> List[MarketingData]:
        query = AnalyticsEngine._apply_record_filter(db.query(MarketingData), record_ids)
        if query is None:
            return []
        return query.all()

    @staticmethod
    def get_analytics(db: Session, record_ids: Optional[List[int]] = None) -> Dict[str, Any]:
        """Get overall analytics"""
        base_query = AnalyticsEngine._apply_record_filter(db.query(MarketingData), record_ids)
        if base_query is None:
            return {
                "total_posts": 0,
                "avg_engagement_score": 0.0,
                "content_type_stats": {},
                "time_of_day_stats": {},
                "top_performing_posts": []
            }

        total_posts = base_query.count()
        if total_posts == 0:
            return {
                "total_posts": 0,
                "avg_engagement_score": 0.0,
                "content_type_stats": {},
                "time_of_day_stats": {},
                "top_performing_posts": []
            }

        avg_engagement_score = round(
            float(base_query.with_entities(func.avg(MarketingData.engagement_score)).scalar() or 0.0),
            2,
        )

        content_rows = base_query.with_entities(
            MarketingData.post_type,
            func.avg(MarketingData.engagement_score),
            func.avg(MarketingData.likes),
            func.avg(MarketingData.comments),
            func.avg(MarketingData.reposts)
        ).group_by(MarketingData.post_type).all()

        content_type_stats = {
            row[0]: {
                "engagement_score": round(float(row[1] or 0.0), 2),
                "likes": round(float(row[2] or 0.0), 2),
                "comments": round(float(row[3] or 0.0), 2),
                "reposts": round(float(row[4] or 0.0), 2)
            }
            for row in content_rows
        }

        hour_expr = AnalyticsEngine._hour_expression(db)
        time_rows = base_query.with_entities(
            hour_expr,
            func.avg(MarketingData.engagement_score),
            func.count(MarketingData.id)
        ).group_by(hour_expr).order_by(hour_expr).all()

        time_of_day_stats = {
            int(row[0]): {
                "engagement_score": round(float(row[1] or 0.0), 2),
                "post_count": int(row[2] or 0)
            }
            for row in time_rows
            if row[0] is not None
        }

        top_rows = base_query.with_entities(
            MarketingData.id,
            MarketingData.post_type,
            MarketingData.engagement_score,
            MarketingData.likes,
            MarketingData.comments,
            MarketingData.reposts
        ).order_by(MarketingData.engagement_score.desc(), MarketingData.id.asc()).limit(10).all()

        top_posts = [
            {
                "id": row[0],
                "post_type": row[1],
                "engagement_score": round(float(row[2] or 0.0), 2),
                "likes": row[3],
                "comments": row[4],
                "reposts": row[5]
            }
            for row in top_rows
        ]

        return {
            "total_posts": total_posts,
            "avg_engagement_score": avg_engagement_score,
            "content_type_stats": content_type_stats,
            "time_of_day_stats": time_of_day_stats,
            "top_performing_posts": top_posts
        }

    @staticmethod
    def get_post_type_analysis(db: Session, record_ids: Optional[List[int]] = None) -> List[Dict[str, Any]]:
        """Analyze performance by content type (matches /analytics/post-type route)"""
        base_query = AnalyticsEngine._apply_record_filter(db.query(MarketingData), record_ids)
        if base_query is None:
            return []

        rows = base_query.with_entities(
            MarketingData.post_type,
            func.avg(MarketingData.engagement_score),
            func.avg(MarketingData.likes),
            func.avg(MarketingData.comments),
            func.avg(MarketingData.reposts)
        ).group_by(MarketingData.post_type).all()

        return [
            {
                "post_type": row[0],
                "engagement_score": round(float(row[1] or 0.0), 2),
                "likes": round(float(row[2] or 0.0), 2),
                "comments": round(float(row[3] or 0.0), 2),
                "reposts": round(float(row[4] or 0.0), 2),
            }
            for row in rows
        ]

    @staticmethod
    def get_time_analysis(db: Session, record_ids: Optional[List[int]] = None) -> List[Dict[str, Any]]:
        """Analyze engagement by posting hour (matches /analytics/time-analysis route)"""
        base_query = AnalyticsEngine._apply_record_filter(db.query(MarketingData), record_ids)
        if base_query is None:
            return []

        hour_expr = AnalyticsEngine._hour_expression(db)
        rows = base_query.with_entities(
            hour_expr,
            func.avg(MarketingData.engagement_score)
        ).group_by(hour_expr).order_by(hour_expr).all()

        return [
            {
                "hour": int(row[0]),
                "engagement_score": round(float(row[1] or 0.0), 2),
            }
            for row in rows
            if row[0] is not None
        ]

    @staticmethod
    def get_follower_analysis(db: Session, record_ids: Optional[List[int]] = None) -> Dict[str, Any]:
        """Example: simple follower count analysis"""
        base_query = AnalyticsEngine._apply_record_filter(db.query(MarketingData), record_ids)
        if base_query is None:
            return {}

        avg_followers, avg_engagement = base_query.with_entities(
            func.avg(MarketingData.followers_count),
            func.avg(MarketingData.engagement_score)
        ).one()

        return {
            "avg_followers": round(float(avg_followers or 0.0), 2),
            "avg_engagement_score": round(float(avg_engagement or 0.0), 2)
        }