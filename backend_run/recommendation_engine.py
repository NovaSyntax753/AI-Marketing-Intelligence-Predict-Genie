from sqlalchemy import cast, func, Integer
from sqlalchemy.orm import Session
from models import MarketingData
from typing import Dict, List, Any


class RecommendationEngine:
    """AI-powered recommendation engine for marketing optimization"""

    @staticmethod
    def _hour_expression(db: Session):
        dialect_name = db.get_bind().dialect.name if db.get_bind() is not None else ""
        if dialect_name == "sqlite":
            return cast(func.strftime("%H", MarketingData.post_date), Integer)
        return cast(func.date_part("hour", MarketingData.post_date), Integer)

    @staticmethod
    def generate_recommendations(db: Session) -> Dict[str, Any]:
        """Generate marketing recommendations"""

        total_count = db.query(func.count(MarketingData.id)).scalar() or 0
        if total_count == 0:
            return {
                "best_posting_times": [],
                "best_content_types": [],
                "caption_suggestions": [],
                "overall_insights": [
                    "Not enough data available. Please upload more marketing data."
                ]
            }

        hour_expr = RecommendationEngine._hour_expression(db)
        time_rows = db.query(
            hour_expr,
            func.avg(MarketingData.engagement_score)
        ).group_by(hour_expr).all()
        time_rows = sorted(
            [row for row in time_rows if row[0] is not None],
            key=lambda row: float(row[1] or 0.0),
            reverse=True,
        )

        best_times = [
            {
                "hour": int(hour),
                "time_label": RecommendationEngine._format_time(int(hour)),
                "avg_engagement": round(float(score or 0.0), 2),
                "recommendation": f"Post at {RecommendationEngine._format_time(int(hour))} for best engagement"
            }
            for hour, score in time_rows[:3]
        ]

        content_rows = db.query(
            MarketingData.post_type,
            func.avg(MarketingData.engagement_score)
        ).group_by(MarketingData.post_type).all()
        content_rows = sorted(
            content_rows,
            key=lambda row: float(row[1] or 0.0),
            reverse=True,
        )

        best_content = [
            {
                "content_type": str(content),
                "avg_engagement": round(float(score or 0.0), 2),
                "recommendation": f"{str(content).capitalize()} posts perform best"
            }
            for content, score in content_rows[:3]
        ]

        caption_suggestions = RecommendationEngine._generate_caption_suggestions()

        insights = RecommendationEngine._generate_insights(db)

        return {
            "best_posting_times": best_times,
            "best_content_types": best_content,
            "caption_suggestions": caption_suggestions,
            "overall_insights": insights
        }

    @staticmethod
    def _format_time(hour: int) -> str:
        """Convert hour to readable format"""

        period = "AM" if hour < 12 else "PM"
        display_hour = hour if hour <= 12 else hour - 12

        if display_hour == 0:
            display_hour = 12

        return f"{display_hour}:00 {period}"

    @staticmethod
    def _generate_caption_suggestions() -> List[Dict[str, str]]:
        """Provide caption writing tips"""

        suggestions = [
            {
                "tip": "Ask engaging questions",
                "example": "What do you think about this?",
                "reason": "Drives more comments"
            },
            {
                "tip": "Use strong CTA",
                "example": "Tag a friend!",
                "reason": "Boosts reach and engagement"
            },
            {
                "tip": "Use hashtags smartly",
                "example": "#Marketing #Growth",
                "reason": "Improves visibility"
            },
            {
                "tip": "Keep captions short",
                "example": "Short captions = more reads",
                "reason": "Better readability"
            }
        ]

        return suggestions

    @staticmethod
    def _generate_insights(db: Session) -> List[str]:
        """Generate AI insights from the dataset"""

        insights = []

        total_count = db.query(func.count(MarketingData.id)).scalar() or 0
        if total_count == 0:
            return ["Not enough data available. Please upload more marketing data."]

        avg_engagement = float(db.query(func.avg(MarketingData.engagement_score)).scalar() or 0.0)
        insights.append(f"Average engagement score is {round(avg_engagement,2)}")

        best_content_row = db.query(
            MarketingData.post_type,
            func.avg(MarketingData.engagement_score)
        ).group_by(MarketingData.post_type).all()
        if best_content_row:
            best_content_row = sorted(best_content_row, key=lambda row: float(row[1] or 0.0), reverse=True)
            best_content = best_content_row[0][0]
            if best_content is not None:
                insights.append(f"{str(best_content).capitalize()} posts perform the best")

        hour_expr = RecommendationEngine._hour_expression(db)
        best_hour_row = db.query(
            hour_expr,
            func.avg(MarketingData.engagement_score)
        ).group_by(hour_expr).all()
        if best_hour_row:
            best_hour_row = sorted(best_hour_row, key=lambda row: float(row[1] or 0.0), reverse=True)
            best_hour = best_hour_row[0][0]
            if best_hour is not None:
                insights.append(f"Best posting time is {RecommendationEngine._format_time(int(best_hour))}")

        above_avg_count = db.query(func.count(MarketingData.id)).filter(
            MarketingData.engagement_score > avg_engagement
        ).scalar() or 0
        percentage = round((above_avg_count / total_count) * 100, 1)

        insights.append(f"{percentage}% of posts perform above average")

        if avg_engagement < 50:
            insights.append("Try improving content quality and posting consistency")
        elif avg_engagement < 150:
            insights.append("Good performance! Experiment with new content formats")
        else:
            insights.append("Excellent engagement! Keep scaling your strategy")

        return insights