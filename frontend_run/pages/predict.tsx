import React, { useState } from "react";
import Layout from "@/components/Layout";
import { predictEngagement, trainModel } from "@/lib/api";
import { FiCpu, FiCheck, FiAlertCircle, FiZap } from "react-icons/fi";

interface TrainResult {
  success: boolean;
  data_count?: number;
  train_score?: number;
  test_score?: number;
}

interface PredictionResult {
  success: boolean;
  predicted_engagement_score?: number;
}

const POST_TYPES = ["image", "video", "reel", "text"];

const formatErrorMessage = (err: unknown, fallback: string): string => {
  const detail = (err as { response?: { data?: { detail?: unknown } } })
    ?.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "msg" in item) {
          return String((item as { msg?: unknown }).msg ?? "Validation error");
        }
        return null;
      })
      .filter((m): m is string => Boolean(m));

    if (messages.length > 0) {
      return messages.join("; ");
    }

    return fallback;
  }

  if (detail && typeof detail === "object" && "msg" in detail) {
    return String((detail as { msg?: unknown }).msg ?? fallback);
  }

  const message = (err as { message?: unknown })?.message;
  return typeof message === "string" ? message : fallback;
};

export default function Predict() {
  const [form, setForm] = useState({
    follower_count: 10000,
    post_type: "reel",
    hashtag_count: 5,
    mention_count: 2,
    cta_used: "yes",
  });

  const [training, setTraining] = useState(false);
  const [trainResult, setTrainResult] = useState<TrainResult | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "post_type" || name === "cta_used" ? value : Number(value),
    }));
  };

  const handleTrain = async () => {
    setTraining(true);
    setTrainResult(null);
    setError(null);
    try {
      const res = await trainModel();
      setTrainResult(res ?? {});
    } catch (err: unknown) {
      const msg = formatErrorMessage(err, "Training failed.");
      setError(msg);
    } finally {
      setTraining(false);
    }
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredicting(true);
    setPrediction(null);
    setError(null);
    try {
      const res = await predictEngagement(form as any);
      setPrediction(res ?? {});
    } catch (err: unknown) {
      const msg = formatErrorMessage(err, "Prediction failed.");
      setError(msg);
    } finally {
      setPredicting(false);
    }
  };

  return (
    <Layout title="Predict" subtitle="Forecast engagement before you post">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          maxWidth: "860px",
          alignItems: "start",
        }}
      >
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Train Card */}
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <div>
                <div className="card-title">Train AI Model</div>
                <div className="card-subtitle" style={{ marginBottom: 0 }}>
                  Build the model on your dataset
                </div>
              </div>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#ede9fe",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiCpu size={18} color="#6c3bfe" />
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={handleTrain}
              disabled={training}
            >
              {training ? (
                <>Training…</>
              ) : (
                <>
                  <FiZap size={14} />
                  Train Model
                </>
              )}
            </button>

            {trainResult?.success && (
              <div
                className="alert alert-success"
                style={{ marginTop: "12px" }}
              >
                <FiCheck size={18} />
                <div>
                  <div className="alert-title">Training complete</div>
                  <div className="alert-body">
                    {trainResult.data_count?.toLocaleString()} records · Train
                    R² {((trainResult.train_score ?? 0) * 100).toFixed(1)}% ·
                    Test R² {((trainResult.test_score ?? 0) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* How It Works */}
          <div
            style={{
              background: "#f1f0fe",
              border: "1px solid #c4b5fd",
              borderRadius: "12px",
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#6c3bfe",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FiZap size={14} /> How it works
            </div>
            {[
              "Upload your dataset on the Upload page",
              'Click "Train Model" to build the ML model',
              "Fill in the form and click Predict",
            ].map((tip, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "8px",
                  fontSize: "13px",
                  color: "#7c3aed",
                }}
              >
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    background: "#ede9fe",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#6c3bfe",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="card">
          <div className="card-title">Predict Engagement</div>
          <div className="card-subtitle">Fill in your post details</div>

          <form
            onSubmit={handlePredict}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Followers + Post Type */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div className="input-group">
                <label className="input-label">Followers</label>
                <input
                  className="input-field"
                  type="number"
                  name="follower_count"
                  value={form.follower_count}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Post Type</label>
                <select
                  className="input-field"
                  name="post_type"
                  value={form.post_type}
                  onChange={handleChange}
                >
                  {POST_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hashtags + Mentions + CTA */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
              }}
            >
              <div className="input-group">
                <label className="input-label">Hashtags</label>
                <input
                  className="input-field"
                  type="number"
                  name="hashtag_count"
                  value={form.hashtag_count}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Mentions</label>
                <input
                  className="input-field"
                  type="number"
                  name="mention_count"
                  value={form.mention_count}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="input-group">
                <label className="input-label">CTA Used</label>
                <select
                  className="input-field"
                  name="cta_used"
                  value={form.cta_used}
                  onChange={handleChange}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: "100%" }}
              disabled={predicting}
            >
              {predicting ? "Predicting…" : "Predict Score"}
            </button>
          </form>

          {/* Prediction Result */}
          {prediction?.success &&
            prediction.predicted_engagement_score !== undefined && (
              <div
                style={{
                  background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
                  border: "2px solid #c4b5fd",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginTop: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#7c3aed",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    letterSpacing: "0.1em",
                  }}
                >
                  Predicted Score
                </div>
                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: 700,
                    color: "#6c3bfe",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {prediction.predicted_engagement_score.toFixed(1)}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#7c3aed",
                    marginTop: "8px",
                  }}
                >
                  Strong engagement expected
                </div>
              </div>
            )}

          {error && (
            <div className="alert alert-error" style={{ marginTop: "16px" }}>
              <FiAlertCircle size={18} />
              <div>
                <div className="alert-title">Error</div>
                <div className="alert-body">{error}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
