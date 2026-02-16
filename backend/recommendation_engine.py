import pandas as pd
from sqlalchemy.orm import Session
from models import MarketingData
from typing import Dict, List, Any
import random

class RecommendationEngine:
    """AI-powered recommendation engine for marketing optimization"""
    
    @staticmethod
    def generate_recommendations(db: Session) -> Dict[str, Any]:
        """Generate comprehensive marketing recommendations"""
        
        # Fetch all data
        data = db.query(MarketingData).all()
        
        if not data:
            return {
                "best_posting_times": [],
                "best_content_types": [],
                "best_platforms": [],
                "caption_suggestions": [],
                "overall_insights": ["Not enough data for recommendations. Please upload more data."]
            }
        
        # Convert to DataFrame
        df = pd.DataFrame([{
            'platform': d.platform,
            'post_type': d.post_type,
            'hour': d.timestamp.hour,
            'engagement_rate': d.engagement_rate,
            'caption': d.caption,
            'likes': d.likes,
            'shares': d.shares
        } for d in data])
        
        # Best posting times
        time_performance = df.groupby('hour')['engagement_rate'].mean().sort_values(ascending=False)
        best_times = [
            {
                "hour": int(hour),
                "time_label": RecommendationEngine._format_time(hour),
                "avg_engagement": round(eng, 2),
                "recommendation": f"Post at {RecommendationEngine._format_time(hour)} for {round(eng, 1)}% avg engagement"
            }
            for hour, eng in time_performance.head(3).items()
        ]
        
        # Best content types
        content_performance = df.groupby('post_type')['engagement_rate'].mean().sort_values(ascending=False)
        best_content = [
            {
                "content_type": content,
                "avg_engagement": round(eng, 2),
                "recommendation": f"Use {content} content - achieves {round(eng, 1)}% engagement"
            }
            for content, eng in content_performance.head(3).items()
        ]
        
        # Best platforms
        platform_performance = df.groupby('platform')['engagement_rate'].mean().sort_values(ascending=False)
        best_platforms = [
            {
                "platform": platform,
                "avg_engagement": round(eng, 2),
                "recommendation": f"Focus on {platform.capitalize()} - {round(eng, 1)}% avg engagement"
            }
            for platform, eng in platform_performance.head(3).items()
        ]
        
        # Caption suggestions based on top performers
        top_posts = df.nlargest(5, 'engagement_rate')
        caption_suggestions = RecommendationEngine._generate_caption_suggestions(top_posts)
        
        # Overall insights
        overall_insights = RecommendationEngine._generate_insights(df)
        
        return {
            "best_posting_times": best_times,
            "best_content_types": best_content,
            "best_platforms": best_platforms,
            "caption_suggestions": caption_suggestions,
            "overall_insights": overall_insights
        }
    
    @staticmethod
    def _format_time(hour: int) -> str:
        """Format hour as readable time"""
        period = "AM" if hour < 12 else "PM"
        display_hour = hour if hour <= 12 else hour - 12
        if display_hour == 0:
            display_hour = 12
        return f"{display_hour}:00 {period}"
    
    @staticmethod
    def _generate_caption_suggestions(top_posts: pd.DataFrame) -> List[Dict[str, str]]:
        """Generate caption suggestions based on top performers"""
        suggestions = []
        
        # Analyze top captions
        captions = top_posts['caption'].dropna().tolist()
        
        if captions:
            # Extract patterns from successful captions
            suggestions.append({
                "tip": "Use engaging questions",
                "example": "What's your favorite way to...?",
                "reason": "Questions encourage comments and interaction"
            })
            suggestions.append({
                "tip": "Include call-to-action",
                "example": "Tag a friend who needs this!",
                "reason": "CTAs increase shares and engagement"
            })
            suggestions.append({
                "tip": "Add relevant hashtags",
                "example": "#MarketingTips #SocialMedia",
                "reason": "Hashtags improve discoverability"
            })
            suggestions.append({
                "tip": "Keep it concise",
                "example": "Short, punchy captions work best",
                "reason": "Users prefer quick, digestible content"
            })
        else:
            suggestions.append({
                "tip": "Start using captions",
                "example": "Add meaningful captions to your posts",
                "reason": "Captions provide context and encourage engagement"
            })
        
        return suggestions
    
    @staticmethod
    def _generate_insights(df: pd.DataFrame) -> List[str]:
        """Generate overall insights from data"""
        insights = []
        
        # Average engagement insight
        avg_engagement = df['engagement_rate'].mean()
        insights.append(f"Your average engagement rate is {round(avg_engagement, 2)}%")
        
        # Platform insight
        best_platform = df.groupby('platform')['engagement_rate'].mean().idxmax()
        insights.append(f"{best_platform.capitalize()} is your best performing platform")
        
        # Content type insight
        best_content = df.groupby('post_type')['engagement_rate'].mean().idxmax()
        insights.append(f"{best_content.capitalize()} posts generate the most engagement")
        
        # Time insight
        best_hour = df.groupby('hour')['engagement_rate'].mean().idxmax()
        insights.append(f"Best posting time: {RecommendationEngine._format_time(best_hour)}")
        
        # Engagement distribution insight
        high_engagement_posts = len(df[df['engagement_rate'] > avg_engagement])
        total_posts = len(df)
        percentage = round((high_engagement_posts / total_posts) * 100, 1)
        insights.append(f"{percentage}% of your posts exceed average engagement")
        
        # Actionable recommendation
        if avg_engagement < 2:
            insights.append("Focus on improving content quality and posting at optimal times")
        elif avg_engagement < 5:
            insights.append("Good progress! Try experimenting with different content formats")
        else:
            insights.append("Excellent engagement! Keep up the great work")
        
        return insights
