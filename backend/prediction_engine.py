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
        
        # Create models directory if it doesn't exist
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        
        # Try to load existing model
        self.load_model()
    
    def train_model(self, db: Session) -> Dict[str, Any]:
        """Train the prediction model on existing data"""
        
        # Fetch all data from database
        data = db.query(MarketingData).all()
        
        if len(data) < 10:
            return {
                "success": False,
                "message": "Not enough data to train model. Need at least 10 records.",
                "data_count": len(data)
            }
        
        # Convert to DataFrame
        df = pd.DataFrame([{
            'platform': d.platform,
            'post_type': d.post_type,
            'hour': d.timestamp.hour,
            'engagement_rate': d.engagement_rate
        } for d in data])
        
        # Prepare features
        self.encoders = {
            'platform': LabelEncoder(),
            'post_type': LabelEncoder()
        }
        
        df['platform_encoded'] = self.encoders['platform'].fit_transform(df['platform'])
        df['post_type_encoded'] = self.encoders['post_type'].fit_transform(df['post_type'])
        
        # Features and target
        X = df[['platform_encoded', 'post_type_encoded', 'hour']]
        y = df['engagement_rate']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train model
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.model.fit(X_train, y_train)
        
        # Evaluate
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        
        self.is_trained = True
        
        # Save model
        self.save_model()
        
        return {
            "success": True,
            "message": "Model trained successfully",
            "train_score": round(train_score, 4),
            "test_score": round(test_score, 4),
            "data_count": len(data)
        }
    
    def predict(self, post_type: str, posting_time: int, platform: str) -> Dict[str, Any]:
        """Predict engagement rate for given inputs"""
        
        if not self.is_trained or self.model is None:
            return {
                "success": False,
                "message": "Model not trained yet. Please train the model first."
            }
        
        try:
            # Encode inputs
            platform_encoded = self.encoders['platform'].transform([platform])[0]
            post_type_encoded = self.encoders['post_type'].transform([post_type])[0]
            
            # Prepare features
            features = np.array([[platform_encoded, post_type_encoded, posting_time]])
            
            # Predict
            prediction = self.model.predict(features)[0]
            
            # Calculate confidence (using feature importances as proxy)
            confidence = round(self.model.score(
                np.array([[platform_encoded, post_type_encoded, posting_time]]),
                np.array([prediction])
            ) * 100, 2)
            
            return {
                "success": True,
                "predicted_engagement": round(prediction, 2),
                "post_type": post_type,
                "posting_time": posting_time,
                "platform": platform,
                "confidence_score": max(0, min(100, confidence))
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Prediction error: {str(e)}"
            }
    
    def save_model(self):
        """Save trained model and encoders to disk"""
        if self.model is not None:
            joblib.dump({
                'model': self.model,
                'encoders': self.encoders,
                'is_trained': self.is_trained
            }, self.model_path)
    
    def load_model(self):
        """Load trained model and encoders from disk"""
        if os.path.exists(self.model_path):
            try:
                data = joblib.load(self.model_path)
                self.model = data['model']
                self.encoders = data['encoders']
                self.is_trained = data.get('is_trained', False)
            except Exception as e:
                print(f"Failed to load model: {e}")
                self.is_trained = False
