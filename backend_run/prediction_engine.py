import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sqlalchemy.orm import Session
from models import MarketingData
import joblib
import os
from pathlib import Path
from typing import Dict, Any, List, Optional


class PredictionEngine:
    """ML-based prediction engine for engagement forecasting"""

    def __init__(self, model_path: str = "models/engagement_model.joblib"):
        default_path = Path(__file__).resolve().parent / "models" / "engagement_model.joblib"
        resolved_path = Path(model_path) if model_path else default_path
        if not resolved_path.is_absolute():
            resolved_path = (Path.cwd() / resolved_path).resolve()

        self.model_path = str(resolved_path)
        self.model = None
        self.encoders = {}
        self.test_record_ids: List[int] = []
        self.is_trained = False
        self.training_score: Optional[float] = None
        self.validation_score: Optional[float] = None

        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)

        self.load_model()

    @staticmethod
    def _build_post_type_mapping(post_types: pd.Series) -> Dict[str, int]:
        unique_values = sorted(post_types.dropna().astype(str).unique().tolist())
        return {value: idx for idx, value in enumerate(unique_values)}

    @staticmethod
    def _encode_post_type_series(post_types: pd.Series, mapping: Dict[str, int]) -> pd.Series:
        return post_types.astype(str).map(mapping).fillna(-1).astype(int)

    @staticmethod
    def _safe_int_ids(raw_ids: List[Any]) -> List[int]:
        return sorted({int(x) for x in raw_ids if x is not None})

    def get_or_create_test_record_ids(self, db: Session) -> List[int]:
        """Return held-out test record IDs, creating a deterministic split if needed."""
        if self.test_record_ids:
            return self.test_record_ids

        data = db.query(MarketingData.id).all()
        if len(data) < 2:
            return []

        id_df = pd.DataFrame(data, columns=["id"])
        _, test_df = train_test_split(id_df, test_size=0.2, random_state=42)
        return self._safe_int_ids(test_df["id"].tolist())

    def train_model(self, db: Session) -> Dict[str, Any]:
        """Train ML model"""

        data = db.query(
            MarketingData.id,
            MarketingData.followers_count,
            MarketingData.post_type,
            MarketingData.post_date,
            MarketingData.likes,
            MarketingData.comments,
            MarketingData.reposts,
            MarketingData.engagement_score,
        ).all()

        if len(data) < 10:
            return {
                "success": False,
                "message": "Need at least 10 records to train model",
                "data_count": len(data)
            }

        # Convert DB rows to dataframe without ORM object overhead.
        df = pd.DataFrame(
            data,
            columns=[
                "id",
                "followers_count",
                "post_type",
                "post_date",
                "likes",
                "comments",
                "reposts",
                "engagement_score",
            ],
        )
        df["hour"] = pd.to_datetime(df["post_date"]).dt.hour

        # Split first so the model and downstream analytics use unseen holdout rows.
        train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)

        post_type_mapping = self._build_post_type_mapping(train_df["post_type"])
        self.encoders["post_type"] = post_type_mapping

        train_df["post_type_encoded"] = self._encode_post_type_series(train_df["post_type"], post_type_mapping)
        test_df["post_type_encoded"] = self._encode_post_type_series(test_df["post_type"], post_type_mapping)

        # Features
        X_train = train_df[[
            "followers_count",
            "post_type_encoded",
            "hour",
            "likes",
            "comments",
            "reposts"
        ]]

        X_test = test_df[[
            "followers_count",
            "post_type_encoded",
            "hour",
            "likes",
            "comments",
            "reposts"
        ]]

        # Target
        y_train = train_df["engagement_score"]
        y_test = test_df["engagement_score"]

        # Model
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )

        self.model.fit(X_train, y_train)

        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        self.training_score = float(train_score)
        self.validation_score = float(test_score)
        self.test_record_ids = self._safe_int_ids(test_df["id"].tolist())

        self.is_trained = True

        self.save_model()

        return {
            "success": True,
            "message": "Model trained successfully",
            "train_score": round(train_score, 4),
            "test_score": round(test_score, 4),
            "train_score_r2": round(train_score, 4),
            "internal_val_score_r2": round(test_score, 4),
            "train_rows_used": len(train_df),
            "test_rows_used": len(test_df),
            "confidence_score": round(max(0.0, min(1.0, float(test_score))), 4),
            "data_count": len(data),
            "train_count": len(train_df),
            "test_count": len(test_df)
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
            post_type_mapping = self.encoders.get("post_type", {})
            post_type_encoded = int(post_type_mapping.get(post_type, -1))

            features = np.array([[
                followers_count,
                post_type_encoded,
                posting_time,
                likes,
                comments,
                reposts
            ]])

            prediction = self.model.predict(features)[0]
            confidence_score = None
            if self.validation_score is not None:
                confidence_score = round(max(0.0, min(1.0, float(self.validation_score))), 4)

            return {
                "success": True,
                "predicted_engagement": round(float(prediction), 2),
                "predicted_engagement_score": round(float(prediction), 2),
                "post_type": post_type,
                "posting_time": posting_time,
                "confidence_score": confidence_score
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
                "test_record_ids": self.test_record_ids,
                "is_trained": self.is_trained,
                "training_score": self.training_score,
                "validation_score": self.validation_score
            }, self.model_path)

    def load_model(self):

        if os.path.exists(self.model_path):

            try:
                data = joblib.load(self.model_path)

                self.model = data["model"]
                self.encoders = data["encoders"]
                self.test_record_ids = self._safe_int_ids(data.get("test_record_ids", []))
                self.training_score = data.get("training_score")
                self.validation_score = data.get("validation_score")

                # Backward compatibility: old models stored sklearn LabelEncoder.
                legacy_encoder = self.encoders.get("post_type")
                if legacy_encoder is not None and not isinstance(legacy_encoder, dict):
                    try:
                        classes = [str(v) for v in legacy_encoder.classes_]
                        self.encoders["post_type"] = {name: idx for idx, name in enumerate(classes)}
                    except Exception:
                        self.encoders["post_type"] = {}

                self.is_trained = data["is_trained"]

            except Exception as e:
                print("Model load failed:", e)
                self.is_trained = False