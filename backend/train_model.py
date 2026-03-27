from database import SessionLocal
from prediction_engine import PredictionEngine

def train():
    db = SessionLocal()

    engine = PredictionEngine()

    result = engine.train_model(db)

    print("\n========================")
    print("MODEL TRAINING RESULT")
    print("========================")
    print(result)

    db.close()

if __name__ == "__main__":
    train()