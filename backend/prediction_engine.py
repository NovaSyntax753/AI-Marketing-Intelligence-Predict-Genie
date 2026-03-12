import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sqlalchemy.orm import Session
from models import MarketingData
import joblib
import os
from typing import Dict, Any


class PredictionEngine:
    """ML-based prediction engine for engagement forecasting"""

    def __init__(self, model_path: str = "models/engagement_model.joblib"):
        self.model_path = model_path
        self.model = None
        self.encoders = {}
        self.is_trained = False

        os.makedirs(os.path.dirname(model_path), exist_ok=True)

        self.load_model()

    def train_model(self, db: Session) -> Dict[str, Any]:
        """Train ML model"""

        data = db.query(MarketingData).all()

        if len(data) < 10:
            return {
                "success": False,
                "message": "Need at least 10 records to train model",
                "data_count": len(data)
            }

        # Convert DB data to dataframe
        df = pd.DataFrame([{
            "followers_count": d.followers_count,
            "post_type": d.post_type,
            "hour": d.post_date.hour,
            "likes": d.likes,
            "comments": d.comments,
            "reposts": d.reposts,
            "engagement_score": d.engagement_score
        } for d in data])

        # Encode post_type
        self.encoders["post_type"] = LabelEncoder()
        df["post_type_encoded"] = self.encoders["post_type"].fit_transform(df["post_type"])

        # Features
        X = df[[
            "followers_count",
            "post_type_encoded",
            "hour",
            "likes",
            "comments",
            "reposts"
        ]]

        # Target
        y = df["engagement_score"]

        # Train test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # Model
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )

        self.model.fit(X_train, y_train)

        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)

        self.is_trained = True

        self.save_model()

        return {
            "success": True,
            "message": "Model trained successfully",
            "train_score": round(train_score, 4),
            "test_score": round(test_score, 4),
            "data_count": len(data)
        }

    def predict(
        self,
        followers_count: int,
        post_type: str,
        posting_time: int,
        likes: int,
        comments: int,
        reposts: int
    ) -> Dict[str, Any]:
        """Predict engagement score"""

        if not self.is_trained or self.model is None:
            return {
                "success": False,
                "message": "Model not trained yet"
            }

        try:

            post_type_encoded = self.encoders["post_type"].transform([post_type])[0]

            features = np.array([[
                followers_count,
                post_type_encoded,
                posting_time,
                likes,
                comments,
                reposts
            ]])

            prediction = self.model.predict(features)[0]

            return {
                "success": True,
                "predicted_engagement_score": round(float(prediction), 2),
                "post_type": post_type,
                "posting_time": posting_time
            }

        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    def save_model(self):

        if self.model is not None:
            joblib.dump({
                "model": self.model,
                "encoders": self.encoders,
                "is_trained": self.is_trained
            }, self.model_path)

    def load_model(self):

        if os.path.exists(self.model_path):

            try:
                data = joblib.load(self.model_path)

                self.model = data["model"]
                self.encoders = data["encoders"]
                self.is_trained = data["is_trained"]

            except Exception as e:
                print("Model load failed:", e)
                self.is_trained = False