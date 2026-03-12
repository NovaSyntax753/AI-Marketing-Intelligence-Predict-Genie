# main.py
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pandas as pd
import io

from database import get_db, init_db
from models import MarketingData
from schemas import (
    MarketingDataInput,
    MarketingDataResponse,
    PredictionInput,
    PredictionResponse
)
from analytics_engine import AnalyticsEngine
from prediction_engine import PredictionEngine
from recommendation_engine import RecommendationEngine

# -----------------------------
# Helper: ensure CSV data exists
# -----------------------------
def ensure_csv_data(db: Session):
    count = db.query(MarketingData).count()
    if count == 0:
        raise HTTPException(
            status_code=400,
            detail="No CSV data uploaded yet. Please upload CSV first."
        )

# -----------------------------
# FastAPI App
# -----------------------------
app = FastAPI(
    title="Predict Genie - AI Marketing Intelligence Platform",
    description="AI-powered marketing analytics and prediction platform",
    version="1.0.0"
)

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# STARTUP
# -----------------------------
@app.on_event("startup")
def startup_event():
    init_db()
    print("Database initialized successfully")

prediction_engine = PredictionEngine()

# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.get("/")
def root():
    return {"message": "Predict Genie API running"}

@app.get("/health")
def health():
    return {"status": "ok"}

# -----------------------------
# CSV DATA UPLOAD
# -----------------------------
@app.post("/upload-data")
async def upload_data(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")

    # Clear old CSV data
    db.query(MarketingData).delete()
    db.commit()

    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    df.columns = df.columns.str.strip()

    required_columns = [
        "user_id", "Followers_count", "Post_ID", "Post_Date",
        "Post_type", "Likes", "Comments", "Reposts", "Engagement_score"
    ]
    missing = [c for c in required_columns if c not in df.columns]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing columns: {', '.join(missing)}")

    records_added = 0
    errors = []
    for idx, row in df.iterrows():
        try:
            record = MarketingData(
                user_id=int(str(row["user_id"]).replace("U", "")),
                followers_count=int(row["Followers_count"]),
                post_id=str(row["Post_ID"]),
                post_date=pd.to_datetime(row["Post_Date"]),
                post_type=str(row["Post_type"]).lower(),
                likes=int(row["Likes"]),
                comments=int(row["Comments"]),
                reposts=int(row["Reposts"]),
                engagement_score=float(row["Engagement_score"])
            )
            db.add(record)
            records_added += 1
        except Exception as e:
            errors.append(f"Row {idx+1}: {str(e)}")

    db.commit()

    return {"success": True, "records_added": records_added, "total_rows": len(df), "errors": errors[:5]}

# -----------------------------
# ADD SINGLE RECORD
# -----------------------------
@app.post("/add-record", response_model=MarketingDataResponse)
def add_record(data: MarketingDataInput, db: Session = Depends(get_db)):
    record = MarketingData(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

# -----------------------------
# ANALYTICS ENDPOINTS
# -----------------------------
@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    ensure_csv_data(db)
    return AnalyticsEngine.get_analytics(db)

@app.get("/analytics/post-type")
def post_type_analysis(db: Session = Depends(get_db)):
    ensure_csv_data(db)
    return AnalyticsEngine.get_post_type_analysis(db)

@app.get("/analytics/time-analysis")
def time_analysis(db: Session = Depends(get_db)):
    ensure_csv_data(db)
    return AnalyticsEngine.get_time_analysis(db)

@app.get("/analytics/followers")
def followers_analysis(db: Session = Depends(get_db)):
    ensure_csv_data(db)
    return AnalyticsEngine.get_follower_analysis(db)

@app.get("/analytics/platform-comparison")
def platform_comparison(db: Session = Depends(get_db)):
    ensure_csv_data(db)
    return AnalyticsEngine.get_follower_analysis(db)

# -----------------------------
# MODEL TRAINING
# -----------------------------
@app.post("/train-model")
def train_model(db: Session = Depends(get_db)):
    ensure_csv_data(db)
    result = prediction_engine.train_model(db)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

# -----------------------------
# PREDICTION
# -----------------------------
@app.post("/predict", response_model=PredictionResponse)
def predict(data: PredictionInput):
    result = prediction_engine.predict(
        followers_count=data.Followers_count,
        post_type=data.Post_type,
        posting_time=data.PostingTime,
        likes=data.Likes,
        comments=data.Comments,
        reposts=data.Reposts
    )
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

# -----------------------------
# RECOMMENDATIONS
# -----------------------------
@app.get("/recommendations")
def recommendations(db: Session = Depends(get_db)):
    ensure_csv_data(db)
    return RecommendationEngine.generate_recommendations(db)

# -----------------------------
# DATA MANAGEMENT
# -----------------------------
@app.get("/data/count")
def data_count(db: Session = Depends(get_db)):
    count = db.query(MarketingData).count()
    return {"total_records": count}

@app.get("/data/recent")
def recent_data(limit: int = 10, db: Session = Depends(get_db)):
    records = db.query(MarketingData).order_by(MarketingData.id.desc()).limit(limit).all()
    return {"records": [r.to_dict() for r in records]}

@app.delete("/data/clear")
def clear_data(db: Session = Depends(get_db)):
    count = db.query(MarketingData).count()
    db.query(MarketingData).delete()
    db.commit()
    return {"success": True, "deleted_records": count}

# -----------------------------
# RUN SERVER
# -----------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)