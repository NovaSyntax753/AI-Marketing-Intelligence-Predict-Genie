import pandas as pd
from sqlalchemy.orm import Session
from models import MarketingData
from typing import Dict, List, Any


class RecommendationEngine:
    """AI-powered recommendation engine for marketing optimization"""

    @staticmethod
    def generate_recommendations(db: Session) -> Dict[str, Any]:
        """Generate marketing recommendations"""

        data = db.query(MarketingData).all()

        if not data:
            return {
                "best_posting_times": [],
                "best_content_types": [],
                "caption_suggestions": [],
                "overall_insights": [
                    "Not enough data available. Please upload more marketing data."
                ]
            }

        # Convert database records to dataframe
        df = pd.DataFrame([{
            "post_type": d.post_type,
            "hour": d.post_date.hour,
            "followers_count": d.followers_count,
            "likes": d.likes,
            "comments": d.comments,
            "reposts": d.reposts,
            "engagement_score": d.engagement_score
        } for d in data])

        # -------------------------
        # Best Posting Times
        # -------------------------
        time_performance = df.groupby("hour")["engagement_score"].mean().sort_values(ascending=False)

        best_times = [
            {
                "hour": int(hour),
                "time_label": RecommendationEngine._format_time(hour),
                "avg_engagement": round(score, 2),
                "recommendation": f"Post at {RecommendationEngine._format_time(hour)} for best engagement"
            }
            for hour, score in time_performance.head(3).items()
        ]

        # -------------------------
        # Best Content Types
        # -------------------------
        content_performance = df.groupby("post_type")["engagement_score"].mean().sort_values(ascending=False)

        best_content = [
            {
                "content_type": content,
                "avg_engagement": round(score, 2),
                "recommendation": f"{content.capitalize()} posts perform best"
            }
            for content, score in content_performance.head(3).items()
        ]

        # -------------------------
        # Caption Suggestions
        # -------------------------
        caption_suggestions = RecommendationEngine._generate_caption_suggestions()

        # -------------------------
        # Insights
        # -------------------------
        insights = RecommendationEngine._generate_insights(df)

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
                "example": "What do you think about this strategy?",
                "reason": "Questions encourage comments and interaction"
            },
            {
                "tip": "Use call-to-action",
                "example": "Tag a friend who needs this!",
                "reason": "CTAs increase engagement and reposts"
            },
            {
                "tip": "Use trending hashtags",
                "example": "#Marketing #DigitalMarketing #SocialMediaTips",
                "reason": "Hashtags improve content discovery"
            },
            {
                "tip": "Keep captions short",
                "example": "Short captions perform better on most platforms",
                "reason": "Users prefer quick readable content"
            }
        ]

        return suggestions

    @staticmethod
    def _generate_insights(df: pd.DataFrame) -> List[str]:
        """Generate AI insights from the dataset"""

        insights = []

        avg_engagement = df["engagement_score"].mean()
        insights.append(f"Average engagement score is {round(avg_engagement,2)}")

        best_content = df.groupby("post_type")["engagement_score"].mean().idxmax()
        insights.append(f"{best_content.capitalize()} posts perform the best")

        best_hour = df.groupby("hour")["engagement_score"].mean().idxmax()
        insights.append(f"Best posting time is {RecommendationEngine._format_time(best_hour)}")

        high_posts = len(df[df["engagement_score"] > avg_engagement])
        percentage = round((high_posts / len(df)) * 100, 1)

        insights.append(f"{percentage}% of posts perform above average")

        if avg_engagement < 50:
            insights.append("Try improving content quality and posting consistency")
        elif avg_engagement < 150:
            insights.append("Good performance! Experiment with new content formats")
        else:
            insights.append("Excellent engagement! Keep scaling your strategy")

        return insights