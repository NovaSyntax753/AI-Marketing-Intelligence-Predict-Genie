import pandas as pd
from database import SessionLocal
from models import MarketingData

CSV_PATH = "data/dataset 1 for predit genie.csv"

def import_csv():

    db = SessionLocal()

    df = pd.read_csv(CSV_PATH)
    df.columns = df.columns.str.strip()
    df["Post_Date"] = pd.to_datetime(df["Post_Date"])

    for _, row in df.iterrows():

        record = MarketingData(
    user_id=int(row["user_id"]),
    Followers_count=int(row["Followers_count"]),
    Post_ID=str(row["Post_ID"]),
    Post_Date=pd.to_datetime(row["Post_Date"]),
    Post_type=str(row["Post_type"]).lower(),
    Likes=int(row["Likes"]),
    Comments=int(row["Comments"]),
    Reposts=int(row["Reposts"]),
    Engagement_score=float(row["Engagement_score"])
)

        db.add(record)

    db.commit()
    db.close()

    print("CSV imported successfully")

if __name__ == "__main__":
    import_csv()