# import pandas as pd
# from sqlalchemy.orm import Session
# from models import MarketingData
# from typing import Dict, List, Any


# class RecommendationEngine:
#     """AI-powered recommendation engine for marketing optimization"""

#     @staticmethod
#     def generate_recommendations(db: Session) -> Dict[str, Any]:

#         data = db.query(MarketingData).all()

#         if not data:
#             return {
#                 "best_posting_times": [],
#                 "best_content_types": [],
#                 "best_cta": [],
#                 "caption_suggestions": [],
#                 "overall_insights": [
#                     "Not enough data available. Please upload more marketing data."
#                 ]
#             }

#         # ✅ FIX: clean + consistent dataframe
#         df = pd.DataFrame([{
#             "post_type": d.post_type,
#             "hour": d.created_at.hour if d.created_at else 0,
#             "follower_count": d.follower_count,
#             "like_count": d.like_count,
#             "comment_count": d.comment_count,
#             "repost_count": d.repost_count,
#             "hashtag_count": d.hashtag_count,
#             "mention_count": d.mention_count,

#             # ✅ FIX: handle null CTA
#             "CTA_used": d.CTA_used if d.CTA_used else "no_cta",

#             # ✅ FIX: consistent engagement formula (NO *100)
#             "engagement_score": ((
#                 d.like_count +
#                 2 * d.comment_count +
#                 3 * d.repost_count
#             ) / max(d.follower_count, 1)) * 100
#         } for d in data])

#         # -------------------------
#         # Best Posting Times
#         # -------------------------
#         time_performance = (
#             df.groupby("hour")["engagement_score"]
#             .mean()
#             .sort_values(ascending=False)
#         )

#         best_times = [
#             {
#                 "hour": int(hour),
#                 "time_label": RecommendationEngine._format_time(hour),
#                 "avg_engagement": round(score, 4),
#                 "recommendation": f"Post at {RecommendationEngine._format_time(hour)}"
#             }
#             for hour, score in time_performance.head(3).items()
#         ]

#         # -------------------------
#         # Best Content Types
#         # -------------------------
#         content_performance = (
#             df.groupby("post_type")["engagement_score"]
#             .mean()
#             .sort_values(ascending=False)
#         )

#         best_content = [
#             {
#                 "content_type": content,
#                 "avg_engagement": round(score, 4),
#                 "recommendation": f"{content.capitalize()} posts perform best"
#             }
#             for content, score in content_performance.head(3).items()
#         ]

#         # -------------------------
#         # CTA Performance
#         # -------------------------
#         cta_performance = (
#             df.groupby("CTA_used")["engagement_score"]
#             .mean()
#             .sort_values(ascending=False)
#         )

#         best_cta = [
#             {
#                 "cta": cta,
#                 "avg_engagement": round(score, 4)
#             }
#             for cta, score in cta_performance.head(3).items()
#         ]

#         # -------------------------
#         # Hashtag Insight
#         # -------------------------
#         avg_hashtags = df["hashtag_count"].mean()

#         # -------------------------
#         # Caption Suggestions
#         # -------------------------
#         caption_suggestions = RecommendationEngine._generate_caption_suggestions()

#         # -------------------------
#         # Insights
#         # -------------------------
#         insights = RecommendationEngine._generate_insights(df, avg_hashtags)

#         return {
#             "best_posting_times": best_times,
#             "best_content_types": best_content,
#             "best_cta": best_cta,
#             "caption_suggestions": caption_suggestions,
#             "overall_insights": insights
#         }

#     # =========================
#     # HELPERS
#     # =========================

#     @staticmethod
#     def _format_time(hour: int) -> str:
#         period = "AM" if hour < 12 else "PM"
#         display_hour = hour if hour <= 12 else hour - 12

#         if display_hour == 0:
#             display_hour = 12

#         return f"{display_hour}:00 {period}"

#     @staticmethod
#     def _generate_caption_suggestions() -> List[Dict[str, str]]:
#         return [
#             {
#                 "tip": "Ask engaging questions",
#                 "example": "What do you think about this?",
#                 "reason": "Drives more comments"
#             },
#             {
#                 "tip": "Use strong CTA",
#                 "example": "Tag a friend!",
#                 "reason": "Boosts reach and engagement"
#             },
#             {
#                 "tip": "Use hashtags smartly",
#                 "example": "#Marketing #Growth",
#                 "reason": "Improves visibility"
#             },
#             {
#                 "tip": "Keep it short",
#                 "example": "Short captions = more reads",
#                 "reason": "Better readability"
#             }
#         ]

#     @staticmethod
#     def _generate_insights(df: pd.DataFrame, avg_hashtags: float) -> List[str]:
#         insights = []

#         avg_engagement = df["engagement_score"].mean()
#         insights.append(f"Average engagement score: {round(avg_engagement, 4)}")

#         best_content = df.groupby("post_type")["engagement_score"].mean().idxmax()
#         insights.append(f"{best_content.capitalize()} posts perform best")

#         best_hour = df.groupby("hour")["engagement_score"].mean().idxmax()
#         insights.append(f"Best posting time: {RecommendationEngine._format_time(best_hour)}")

#         insights.append(f"Average hashtags used: {round(avg_hashtags, 1)}")

#         high_posts = len(df[df["engagement_score"] > avg_engagement])
#         percentage = round((high_posts / len(df)) * 100, 1)
#         insights.append(f"{percentage}% posts perform above average")

#         # ✅ FIX: realistic thresholds (since no *100 now)
#         if avg_engagement < 0.02:
#             insights.append("Improve content quality & consistency")
#         elif avg_engagement < 0.05:
#             insights.append("Good performance — experiment with formats")
#         else:
#             insights.append("Excellent engagement — scale strategy")

#         return insights

import pandas as pd
from sqlalchemy.orm import Session
from models import MarketingData
from typing import Dict, List, Any
from prediction_engine import PredictionEngine
import random
import json
import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


class RecommendationEngine:
    """AI-powered recommendation engine with Gemini captions"""

    @staticmethod
    def generate_recommendations(db: Session) -> Dict[str, Any]:

        data = db.query(MarketingData).all()

        if not data:
            return {
                "best_posting_times": [],
                "best_content_types": [],
                "best_cta": [],
                "caption_suggestions": [],
                "overall_insights": [
                    "Not enough data available. Please upload more marketing data."
                ]
            }

        # -------------------------
        # DataFrame
        # -------------------------
        df = pd.DataFrame([{
            "post_type": d.post_type,
            "hour": d.created_at.hour if d.created_at else 0,
            "follower_count": d.follower_count,
            "hashtag_count": d.hashtag_count,
            "mention_count": d.mention_count,
            "CTA_used": d.CTA_used if d.CTA_used else "no_cta",
            "engagement_score": RecommendationEngine.calculate_engagement(
                d.like_count, d.comment_count, d.repost_count, d.follower_count
            )
        } for d in data])

        # -------------------------
        # 📊 TIME RECOMMENDATION
        # -------------------------
        hour_counts = df["hour"].value_counts()
        valid_hours = hour_counts[hour_counts >= 2].index
        filtered_df = df[df["hour"].isin(valid_hours)]

        if filtered_df.empty:
            filtered_df = df

        time_performance = (
            filtered_df.groupby("hour")["engagement_score"]
            .mean()
            .sort_values(ascending=False)
        )

        top_hours = time_performance.head(5).index.tolist()
        selected_hours = random.sample(top_hours, min(3, len(top_hours)))

        best_times = [
            {
                "hour": int(hour),
                "time_label": RecommendationEngine._format_time(hour),
                "avg_engagement": round(time_performance[hour] * 100, 2)
            }
            for hour in selected_hours
        ]

        # -------------------------
        # 🤖 CONTENT TYPE (ML)
        # -------------------------
        prediction_engine = PredictionEngine()

        if not prediction_engine.is_trained:
            return {"error": "Model not trained. Train model first."}

        avg_followers = int(df["follower_count"].mean())
        unique_post_types = df["post_type"].unique()

        predictions = []

        for post_type in unique_post_types:
            result = prediction_engine.predict(
                follower_count=avg_followers,
                post_type=post_type,
                hashtag_count=int(df["hashtag_count"].mean()),
                mention_count=int(df["mention_count"].mean()),
                cta_used="no_cta"
            )

            if result["success"]:
                predictions.append({
                    "content_type": post_type,
                    "avg_engagement": round(result["predicted_engagement_score"], 4) * 100,
                    "recommendation": f"{post_type.capitalize()} performs best"
                })

        best_content = sorted(predictions, key=lambda x: x["avg_engagement"], reverse=True)[:3]

        # -------------------------
        # 🤖 CTA (ML)
        # -------------------------
        cta_options = df["CTA_used"].unique().tolist()

        if len(cta_options) < 3:
            cta_options += ["buy_now", "learn_more", "subscribe", "shop_now"]

        cta_options = list(set(cta_options))

        avg_hashtags = int(df["hashtag_count"].mean())
        avg_mentions = int(df["mention_count"].mean())
        best_post_type = df["post_type"].mode()[0]

        cta_predictions = []

        for cta in cta_options:
            result = prediction_engine.predict(
                follower_count=avg_followers,
                post_type=best_post_type,
                hashtag_count=avg_hashtags,
                mention_count=avg_mentions,
                cta_used=cta
            )

            if result["success"]:
                cta_predictions.append({
                    "cta": cta,
                    "predicted_engagement": result["predicted_engagement_score"] * 100
                })

        best_cta = sorted(cta_predictions, key=lambda x: x["predicted_engagement"], reverse=True)[:2]

        # -------------------------
        # 🔥 GEMINI CAPTIONS
        # -------------------------
        caption_suggestions = RecommendationEngine._generate_llm_captions(df)

        # -------------------------
        # 📊 INSIGHTS
        # -------------------------
        avg_hashtags = df["hashtag_count"].mean()
        insights = RecommendationEngine._generate_insights(df, avg_hashtags)

        return {
            "avg_engagement": round(df["engagement_score"].mean(), 4) * 100,
            "best_posting_times": best_times,
            "best_content_types": best_content,
            "best_cta": best_cta,
            "caption_suggestions": caption_suggestions,
            "overall_insights": insights
        }

    # =========================
    # 🔥 GEMINI CAPTION GENERATOR
    # =========================
    @staticmethod
    def _generate_llm_captions(df: pd.DataFrame):

        best_post_type = df["post_type"].mode()[0]
        best_cta = df.groupby("CTA_used")["engagement_score"].mean().idxmax()
        avg_engagement = round(df["engagement_score"].mean(), 4)
        avg_hashtags = int(df["hashtag_count"].mean())

        prompt = f"""
You are a professional social media marketing expert.

Generate 5 Short Captions Tips.

Context:
- Best content type: {best_post_type}
- Best CTA: {best_cta}
- Avg engagement: {avg_engagement}
- Avg hashtags: {avg_hashtags}

Rules:
- Each tip must be VERY SHORT (5-10 words)
- Focus on actionable advice
- Examples:
  - "Ask questions to boost comments"
  - "Use 5-7 relevant hashtags"
  - "Add strong CTA like Follow or Share"

Return ONLY JSON:
[
  {{ "caption": "..." }},
  {{ "caption": "..." }},
  {{ "caption": "..." }},
  {{ "caption": "..." }},
  {{ "caption": "..." }}
]
"""

        try:
            model = genai.GenerativeModel("models/gemini-flash-latest")
            response = model.generate_content(prompt)

            text = response.text.strip()

            # 🔥 Fix JSON formatting issue
            text = text.replace("```json", "").replace("```", "").strip()

            return json.loads(text)

        except Exception as e:
            print("Gemini Error:", e)

            # fallback captions
            return [
                {"caption": "Boost your engagement with smart content 🚀"},
                {"caption": "Try this strategy to grow faster 🔥"},
                {"caption": "Consistency is key to success 💡"}
            ]

    # =========================
    @staticmethod
    def calculate_engagement(like_count, comment_count, repost_count, follower_count):
        return (like_count + 2 * comment_count + 3 * repost_count) / max(follower_count, 1)

    @staticmethod
    def _format_time(hour: int) -> str:
        period = "AM" if hour < 12 else "PM"
        display_hour = hour if hour <= 12 else hour - 12
        if display_hour == 0:
            display_hour = 12
        return f"{display_hour}:00 {period}"

    @staticmethod
    def _generate_insights(df: pd.DataFrame, avg_hashtags: float):

        insights = []

        avg_engagement = round(df["engagement_score"].mean(), 4) * 100
        insights.append(f"Average engagement score: {avg_engagement}")

        best_content = df.groupby("post_type")["engagement_score"].mean().idxmax()
        insights.append(f"{best_content.capitalize()} posts performed best")

        best_hour = df.groupby("hour")["engagement_score"].mean().idxmax()
        insights.append(f"Best posting time: {RecommendationEngine._format_time(best_hour)}")

        insights.append(f"Average hashtags used: {round(avg_hashtags, 1)}")

        return insights