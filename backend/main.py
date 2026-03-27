# from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from sqlalchemy.orm import Session
# import pandas as pd
# import io

# from database import get_db, init_db
# from models import MarketingData
# from schemas import (
#     MarketingDataInput,
#     MarketingDataResponse,
#     PredictionInput,
#     PredictionResponse
# )
# from analytics_engine import AnalyticsEngine
# from prediction_engine import PredictionEngine
# from recommendation_engine import RecommendationEngine


# # -----------------------------
# # Helper
# # -----------------------------
# def ensure_csv_data(db: Session):
#     if db.query(MarketingData).count() == 0:
#         raise HTTPException(status_code=400, detail="Upload CSV first")


# # -----------------------------
# # FastAPI App
# # -----------------------------
# app = FastAPI(title="Predict Genie", version="1.0.0")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # -----------------------------
# # STARTUP
# # -----------------------------
# @app.on_event("startup")
# def startup_event():
#     init_db()
#     print("DB Ready")


# prediction_engine = PredictionEngine()


# # -----------------------------
# # HEALTH
# # -----------------------------
# @app.get("/")
# def root():
#     return {"message": "API running"}

# @app.get("/health")
# def health():
#     return {"status": "ok"}


# # -----------------------------
# # CSV UPLOAD (FIXED)
# # -----------------------------
# @app.post("/upload-data")
# async def upload_data(file: UploadFile = File(...), db: Session = Depends(get_db)):

#     if not file.filename.endswith(".csv"):
#         raise HTTPException(status_code=400, detail="Upload CSV only")

#     db.query(MarketingData).delete()
#     db.commit()

#     contents = await file.read()
#     df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
#     df.columns = df.columns.str.strip().str.lower()

#     required_columns = [
#         "name",
#         "follower_count",
#         "post_type",
#         "like_count",
#         "comment_count",
#         "repost_count",
#         "hashtag_count",
#         "mention_count",
#         "cta_used"
#     ]

#     missing = [c for c in required_columns if c not in df.columns]
#     if missing:
#         raise HTTPException(status_code=400, detail=f"Missing columns: {missing}")

#     # ✅ FIX: handle null CTA
#     df["cta_used"] = df["cta_used"].fillna("no_cta")

#     records_added = 0
#     errors = []

#     for idx, row in df.iterrows():
#         try:
#             record = MarketingData(
#                 name=str(row["name"]),
#                 follower_count=int(row["follower_count"]),
#                 post_type=str(row["post_type"]).lower(),
#                 like_count=int(row["like_count"]),
#                 comment_count=int(row["comment_count"]),
#                 repost_count=int(row["repost_count"]),
#                 hashtag_count=int(row["hashtag_count"]),
#                 mention_count=int(row["mention_count"]),
#                 CTA_used=str(row["cta_used"])
#             )

#             # ✅ FIX: consistent formula (NO *100)
#             record.engagement_score = (
#                 record.like_count +
#                 2 * record.comment_count +
#                 3 * record.repost_count
#             ) / max(record.follower_count, 1)

#             db.add(record)
#             records_added += 1

#         except Exception as e:
#             errors.append(f"Row {idx+1}: {str(e)}")

#     db.commit()

#     return {
#         "success": True,
#         "records_added": records_added,
#         "total_rows": len(df),
#         "errors": errors[:5]
#     }


# # -----------------------------
# # ADD SINGLE RECORD
# # -----------------------------
# @app.post("/add-record", response_model=MarketingDataResponse)
# def add_record(data: MarketingDataInput, db: Session = Depends(get_db)):

#     record = MarketingData(**data.dict())

#     # ✅ FIX: same formula everywhere
#     record.engagement_score = ((
#         record.like_count +
#         2 * record.comment_count +
#         3 * record.repost_count
#     ) / max(record.follower_count, 1)) * 100

#     db.add(record)
#     db.commit()
#     db.refresh(record)

#     return record


# # -----------------------------
# # ANALYTICS
# # -----------------------------
# @app.get("/analytics")
# def analytics(db: Session = Depends(get_db)):
#     ensure_csv_data(db)
#     return AnalyticsEngine.get_analytics(db)


# # -----------------------------
# # TRAIN MODEL
# # -----------------------------
# @app.post("/train-model")
# def train_model(db: Session = Depends(get_db)):
#     ensure_csv_data(db)

#     result = prediction_engine.train_model(db)

#     if not result["success"]:
#         raise HTTPException(status_code=400, detail=result["message"])

#     return result


# # -----------------------------
# # PREDICT (FIXED)
# # -----------------------------
# @app.post("/predict", response_model=PredictionResponse)
# def predict(data: PredictionInput):

#     result = prediction_engine.predict(
#         # follower_count=data.follower_count,
#         # post_type=data.post_type,
#         # like_count=data.like_count,
#         # comment_count=data.comment_count,
#         # repost_count=data.repost_count,
#         # hashtag_count=data.hashtag_count,
#         # mention_count=data.mention_count,
#         # cta_used=data.cta_used   # ✅ FIXED
#         follower_count=data.follower_count,
#         post_type=data.post_type,
#         hashtag_count=data.hashtag_count,
#         mention_count=data.mention_count,
#         cta_used=data.cta_used
# )
    

#     if not result["success"]:
#         raise HTTPException(status_code=400, detail=result["message"])

#     # ✅ FIX: return only required fields
#     return {
#           "success": True,
#     "predicted_engagement_score": result["predicted_engagement_score"],
#     "confidence_score": result["confidence_score"]
#     }


# # -----------------------------
# # RECOMMENDATIONS
# # -----------------------------
# @app.get("/recommendations")
# def recommendations(db: Session = Depends(get_db)):
#     ensure_csv_data(db)
#     return RecommendationEngine.generate_recommendations(db)


# # -----------------------------
# # DATA MANAGEMENT
# # -----------------------------
# @app.get("/data/count")
# def data_count(db: Session = Depends(get_db)):
#     return {"total_records": db.query(MarketingData).count()}


# @app.get("/data/recent")
# def recent_data(limit: int = 10, db: Session = Depends(get_db)):
#     records = (
#         db.query(MarketingData)
#         .order_by(MarketingData.id.desc())
#         .limit(limit)
#         .all()
#     )
#     return {"records": [r.to_dict() for r in records]}


# @app.delete("/data/clear")
# def clear_data(db: Session = Depends(get_db)):
#     count = db.query(MarketingData).count()
#     db.query(MarketingData).delete()
#     db.commit()
#     return {"deleted": count}


# # -----------------------------
# # EXTRA ANALYTICS ROUTES
# # -----------------------------
# @app.get("/analytics/post-type")
# def post_type_analysis(db: Session = Depends(get_db)):
#     ensure_csv_data(db)
#     return AnalyticsEngine.get_post_type_analysis(db)


# @app.get("/analytics/time-analysis")
# def time_analysis(db: Session = Depends(get_db)):
#     ensure_csv_data(db)
#     return AnalyticsEngine.get_time_analysis(db)


# @app.get("/analytics/followers")
# def followers_analysis(db: Session = Depends(get_db)):
#     ensure_csv_data(db)
#     return AnalyticsEngine.get_follower_analysis(db)


# # -----------------------------
# # RUN
# # -----------------------------
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", reload=True)

from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pandas as pd
import io
import os

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
# FastAPI App
# -----------------------------
app = FastAPI(title="Predict Genie", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

prediction_engine = PredictionEngine()

# -----------------------------
# STARTUP
# -----------------------------
@app.on_event("startup")
def startup_event():
    init_db()

    # ✅ AUTO LOAD TRAINED MODEL
    if prediction_engine.is_trained:
        print("✅ Model Loaded Successfully")
    else:
        print("⚠️ Model not found. Train once using script")

# -----------------------------
# HEALTH
# -----------------------------
@app.get("/")
def root():
    return {"message": "API running"}

# -----------------------------
# CSV UPLOAD (USER TEST DATA)
# -----------------------------
@app.post("/upload-data")
async def upload_data(file: UploadFile = File(...), db: Session = Depends(get_db)):

    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Upload CSV only")

    db.query(MarketingData).delete()
    db.commit()

    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    df.columns = df.columns.str.strip().str.lower()

    required_columns = [
        "name",
        "follower_count",
        "post_type",
        "like_count",
        "comment_count",
        "repost_count",
        "hashtag_count",
        "mention_count",
        "cta_used"
    ]

    missing = [c for c in required_columns if c not in df.columns]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing columns: {missing}")

    df["cta_used"] = df["cta_used"].fillna("no_cta")

    for _, row in df.iterrows():
        record = MarketingData(
            name=str(row["name"]),
            follower_count=int(row["follower_count"]),
            post_type=str(row["post_type"]).lower(),
            like_count=int(row["like_count"]),
            comment_count=int(row["comment_count"]),
            repost_count=int(row["repost_count"]),
            hashtag_count=int(row["hashtag_count"]),
            mention_count=int(row["mention_count"]),
            CTA_used=str(row["cta_used"])
        )

        record.engagement_score = (
            record.like_count +
            2 * record.comment_count +
            3 * record.repost_count
        ) / max(record.follower_count, 1)

        db.add(record)

    db.commit()

    return {"success": True, "message": "User CSV uploaded"}

# -----------------------------
# ANALYTICS (USER DATA)
# -----------------------------
@app.get("/analytics")
def analytics(db: Session = Depends(get_db)):
    return AnalyticsEngine.get_analytics(db)

# -----------------------------
# PREDICT (MODEL USE)
# -----------------------------
@app.post("/predict", response_model=PredictionResponse)
def predict(data: PredictionInput):

    result = prediction_engine.predict(
        follower_count=data.follower_count,
        post_type=data.post_type,
        hashtag_count=data.hashtag_count,
        mention_count=data.mention_count,
        cta_used=data.cta_used
    )

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])

    return result

# -----------------------------
# RECOMMENDATIONS (USER DATA)
# -----------------------------
@app.get("/recommendations")
def recommendations(db: Session = Depends(get_db)):
    return RecommendationEngine.generate_recommendations(db)

@app.get("/data/count")
def get_data_count(db: Session = Depends(get_db)):
    count = db.query(MarketingData).count()
    return {"count": count}

@app.get("/data/recent")
def get_recent_data(limit: int = 10, db: Session = Depends(get_db)):
    data = db.query(MarketingData).order_by(MarketingData.id.desc()).limit(limit).all()
    return data
@app.get("/analytics/post-type")
def post_type_analysis(db: Session = Depends(get_db)):
    return AnalyticsEngine.get_post_type_analysis(db)

@app.get("/analytics/time-analysis")
def time_analysis(db: Session = Depends(get_db)):
    return AnalyticsEngine.get_time_analysis(db)
# -----------------------------
# RUN
# -----------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", reload=True)