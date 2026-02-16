from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pandas as pd
import io
from datetime import datetime
from typing import List

from database import get_db, init_db
from models import MarketingData
from schemas import (
    MarketingDataInput, 
    MarketingDataResponse,
    PredictionInput,
    PredictionResponse,
    AnalyticsResponse,
    RecommendationResponse
)
from analytics_engine import AnalyticsEngine
from prediction_engine import PredictionEngine
from recommendation_engine import RecommendationEngine

# Initialize FastAPI app
app = FastAPI(
    title="Predict Genie - AI Marketing Intelligence Platform",
    description="AI-powered marketing analytics and prediction platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()
    print("✅ Database initialized successfully")

# Initialize prediction engine
prediction_engine = PredictionEngine()

# Health check endpoint
@app.get("/")
def read_root():
    return {
        "message": "Welcome to Predict Genie API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# MODULE 1: Data Ingestion
@app.post("/upload-data", response_model=dict)
async def upload_data(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload CSV file with marketing data
    Expected columns: platform, impressions, likes, comments, shares, post_type, caption, timestamp
    """
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")
    
    try:
        # Read CSV file
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Validate required columns
        required_columns = ['platform', 'impressions', 'likes', 'comments', 'shares', 'post_type', 'timestamp']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required columns: {', '.join(missing_columns)}"
            )
        
        # Process and insert data
        records_added = 0
        errors = []
        
        for idx, row in df.iterrows():
            try:
                # Parse timestamp
                timestamp = pd.to_datetime(row['timestamp'])
                
                # Calculate engagement rate
                engagement_rate = AnalyticsEngine.calculate_engagement_rate(
                    int(row['likes']),
                    int(row['comments']),
                    int(row['shares']),
                    int(row['impressions'])
                )
                
                # Create database record
                marketing_data = MarketingData(
                    platform=str(row['platform']).lower(),
                    impressions=int(row['impressions']),
                    likes=int(row['likes']),
                    comments=int(row['comments']),
                    shares=int(row['shares']),
                    post_type=str(row['post_type']).lower(),
                    caption=str(row.get('caption', '')) if pd.notna(row.get('caption')) else None,
                    timestamp=timestamp,
                    engagement_rate=engagement_rate
                )
                
                db.add(marketing_data)
                records_added += 1
                
            except Exception as e:
                errors.append(f"Row {idx + 1}: {str(e)}")
        
        db.commit()
        
        return {
            "success": True,
            "message": f"Data uploaded successfully",
            "records_added": records_added,
            "total_rows": len(df),
            "errors": errors[:10] if errors else []
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/add-record", response_model=MarketingDataResponse)
def add_record(data: MarketingDataInput, db: Session = Depends(get_db)):
    """Add a single marketing data record"""
    
    # Calculate engagement rate
    engagement_rate = AnalyticsEngine.calculate_engagement_rate(
        data.likes,
        data.comments,
        data.shares,
        data.impressions
    )
    
    # Create database record
    marketing_data = MarketingData(
        platform=data.platform,
        impressions=data.impressions,
        likes=data.likes,
        comments=data.comments,
        shares=data.shares,
        post_type=data.post_type,
        caption=data.caption,
        timestamp=data.timestamp,
        engagement_rate=engagement_rate
    )
    
    db.add(marketing_data)
    db.commit()
    db.refresh(marketing_data)
    
    return marketing_data

# MODULE 2: Analytics
@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    """Get comprehensive analytics of all marketing data"""
    
    analytics = AnalyticsEngine.get_analytics(db)
    return analytics

@app.get("/analytics/platform-comparison")
def get_platform_comparison(db: Session = Depends(get_db)):
    """Get platform performance comparison"""
    
    comparison = AnalyticsEngine.get_platform_comparison(db)
    return {"platforms": comparison}

@app.get("/analytics/content-type")
def get_content_type_analysis(db: Session = Depends(get_db)):
    """Get content type performance analysis"""
    
    analysis = AnalyticsEngine.get_content_type_analysis(db)
    return {"content_types": analysis}

@app.get("/analytics/time-analysis")
def get_time_analysis(db: Session = Depends(get_db)):
    """Get time-based performance analysis"""
    
    analysis = AnalyticsEngine.get_time_analysis(db)
    return {"time_analysis": analysis}

# MODULE 3: Prediction
@app.post("/train-model")
def train_model(db: Session = Depends(get_db)):
    """Train the ML prediction model"""
    
    result = prediction_engine.train_model(db)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return result

@app.post("/predict")
def predict_engagement(data: PredictionInput, db: Session = Depends(get_db)):
    """Predict engagement for given parameters"""
    
    result = prediction_engine.predict(
        post_type=data.post_type,
        posting_time=data.posting_time,
        platform=data.platform
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return result

# MODULE 4: Recommendations
@app.get("/recommendations")
def get_recommendations(db: Session = Depends(get_db)):
    """Get AI-powered marketing recommendations"""
    
    recommendations = RecommendationEngine.generate_recommendations(db)
    return recommendations

# Data Management
@app.get("/data/count")
def get_data_count(db: Session = Depends(get_db)):
    """Get total count of marketing data records"""
    
    count = db.query(MarketingData).count()
    return {"total_records": count}

@app.get("/data/recent")
def get_recent_data(limit: int = 10, db: Session = Depends(get_db)):
    """Get recent marketing data records"""
    
    data = db.query(MarketingData).order_by(
        MarketingData.created_at.desc()
    ).limit(limit).all()
    
    return {"records": [d.to_dict() for d in data]}

@app.delete("/data/clear")
def clear_all_data(db: Session = Depends(get_db)):
    """Clear all marketing data (use with caution)"""
    
    count = db.query(MarketingData).count()
    db.query(MarketingData).delete()
    db.commit()
    
    return {
        "success": True,
        "message": f"Deleted {count} records",
        "records_deleted": count
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
