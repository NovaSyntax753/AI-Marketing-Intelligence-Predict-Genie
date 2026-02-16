import pandas as pd
from sqlalchemy.orm import Session
from models import MarketingData
from typing import Dict, List, Any

class AnalyticsEngine:
    """Analytics engine for marketing data analysis"""
    
    @staticmethod
    def calculate_engagement_rate(likes: int, comments: int, shares: int, impressions: int) -> float:
        """Calculate engagement rate as percentage"""
        if impressions == 0:
            return 0.0
        total_engagement = likes + comments + shares
        return round((total_engagement / impressions) * 100, 2)
    
    @staticmethod
    def get_analytics(db: Session) -> Dict[str, Any]:
        """Get comprehensive analytics from the database"""
        
        # Fetch all data
        data = db.query(MarketingData).all()
        
        if not data:
            return {
                "total_posts": 0,
                "avg_engagement_rate": 0.0,
                "platform_stats": {},
                "content_type_stats": {},
                "time_of_day_stats": {},
                "top_performing_posts": []
            }
        
        # Convert to DataFrame for easier analysis
        df = pd.DataFrame([{
            'id': d.id,
            'platform': d.platform,
            'impressions': d.impressions,
            'likes': d.likes,
            'comments': d.comments,
            'shares': d.shares,
            'post_type': d.post_type,
            'caption': d.caption,
            'timestamp': d.timestamp,
            'engagement_rate': d.engagement_rate
        } for d in data])
        
        # Extract hour from timestamp
        df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
        
        # Calculate statistics
        total_posts = len(df)
        avg_engagement_rate = round(df['engagement_rate'].mean(), 2)
        
        # Platform statistics
        platform_stats = df.groupby('platform').agg({
            'engagement_rate': 'mean',
            'impressions': 'sum',
            'likes': 'sum',
            'comments': 'sum',
            'shares': 'sum'
        }).round(2).to_dict('index')
        
        # Content type statistics
        content_type_stats = df.groupby('post_type').agg({
            'engagement_rate': 'mean',
            'impressions': 'sum',
            'likes': 'sum'
        }).round(2).to_dict('index')
        
        # Time of day statistics
        time_of_day_stats = df.groupby('hour').agg({
            'engagement_rate': 'mean',
            'id': 'count'
        }).rename(columns={'id': 'post_count'}).round(2).to_dict('index')
        
        # Top performing posts
        top_posts = df.nlargest(10, 'engagement_rate')[
            ['id', 'platform', 'post_type', 'engagement_rate', 'likes', 'comments', 'shares']
        ].to_dict('records')
        
        return {
            "total_posts": total_posts,
            "avg_engagement_rate": avg_engagement_rate,
            "platform_stats": platform_stats,
            "content_type_stats": content_type_stats,
            "time_of_day_stats": time_of_day_stats,
            "top_performing_posts": top_posts
        }
    
    @staticmethod
    def get_platform_comparison(db: Session) -> List[Dict[str, Any]]:
        """Compare performance across platforms"""
        data = db.query(MarketingData).all()
        
        if not data:
            return []
        
        df = pd.DataFrame([{
            'platform': d.platform,
            'engagement_rate': d.engagement_rate,
            'impressions': d.impressions
        } for d in data])
        
        comparison = df.groupby('platform').agg({
            'engagement_rate': 'mean',
            'impressions': 'mean'
        }).reset_index().round(2).to_dict('records')
        
        return comparison
    
    @staticmethod
    def get_content_type_analysis(db: Session) -> List[Dict[str, Any]]:
        """Analyze performance by content type"""
        data = db.query(MarketingData).all()
        
        if not data:
            return []
        
        df = pd.DataFrame([{
            'post_type': d.post_type,
            'engagement_rate': d.engagement_rate,
            'likes': d.likes,
            'comments': d.comments,
            'shares': d.shares
        } for d in data])
        
        analysis = df.groupby('post_type').agg({
            'engagement_rate': 'mean',
            'likes': 'mean',
            'comments': 'mean',
            'shares': 'mean'
        }).reset_index().round(2).to_dict('records')
        
        return analysis
    
    @staticmethod
    def get_time_analysis(db: Session) -> List[Dict[str, Any]]:
        """Analyze performance by posting time"""
        data = db.query(MarketingData).all()
        
        if not data:
            return []
        
        df = pd.DataFrame([{
            'timestamp': d.timestamp,
            'engagement_rate': d.engagement_rate
        } for d in data])
        
        df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
        
        analysis = df.groupby('hour').agg({
            'engagement_rate': 'mean'
        }).reset_index().round(2).to_dict('records')
        
        return analysis
