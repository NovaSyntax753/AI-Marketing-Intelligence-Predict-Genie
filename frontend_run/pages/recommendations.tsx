import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getRecommendations } from "@/lib/api";
import { FiClock, FiImage, FiEdit3, FiZap, FiRefreshCw } from "react-icons/fi";
import Link from "next/link";

interface PostingTime {
  hour: number;
  time_label: string;
  avg_engagement: number;
  recommendation: string;
}

interface ContentType {
  content_type: string;
  avg_engagement: number;
  recommendation: string;
}

interface CaptionTip {
  tip: string;
  example: string;
  reason: string;
}

interface Recommendations {
  overall_insights: string[];
  best_posting_times: PostingTime[];
  best_content_types: ContentType[];
  caption_suggestions: CaptionTip[];
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  reel: { bg: "#fdf2f8", text: "#a21caf" },
  video: { bg: "#eff6ff", text: "#1d4ed8" },
  image: { bg: "#fff7ed", text: "#c2410c" },
  text: { bg: "#f0fdf4", text: "#15803d" },
};

export default function Recommendations() {
  const [recs, setRecs] = useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getRecommendations();
      setRecs(data ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Recommendations">
        <div className="loading-screen">
          <div className="spinner" />
          Generating recommendations…
        </div>
      </Layout>
    );
  }

  const hasData =
    recs &&
    recs.overall_insights?.length > 0 &&
    !recs.overall_insights[0]?.toLowerCase().includes("not enough");

  if (!hasData) {
    return (
      <Layout title="Recommendations">
        <div className="empty-state">
          <div className="empty-state-icon">💡</div>
          <div className="empty-state-title">No recommendations yet</div>
          <div className="empty-state-desc">
            Upload a dataset with at least 10 records to receive AI-powered
            insights.
          </div>
          <Link href="/upload" className="btn btn-primary">
            Upload Dataset
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Recommendations"
      subtitle="AI-powered strategies to maximize engagement"
    >
      {/* Key Insights Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e1b4b, #312e81)",
          border: "none",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
          color: "white",
        }}
        className="animate-fade-up"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          <FiZap size={16} color="#a5b4fc" />
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#a5b4fc",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Key Insights
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          {recs!.overall_insights.map((insight, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "12px 14px",
                fontSize: "13.5px",
                color: "#e0e7ff",
                lineHeight: 1.5,
              }}
            >
              <span
                style={{
                  color: "#818cf8",
                  fontWeight: 700,
                  marginRight: "6px",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {insight}
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Best Posting Times */}
        <div className="card animate-fade-up">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "#ede9fe",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiClock size={15} color="#6c3bfe" />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>
              Best Posting Times
            </h3>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {recs!.best_posting_times.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  background: i === 0 ? "#f1f0fe" : "#f8fafc",
                  border: `1px solid ${i === 0 ? "#c4b5fd" : "#eef1f7"}`,
                  borderRadius: "10px",
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    background: i === 0 ? "#6c3bfe" : "#f1f5f9",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: i === 0 ? "white" : "#64748b",
                    flexShrink: 0,
                  }}
                >
                  #{i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "14.5px",
                      color: "#0f172a",
                    }}
                  >
                    {t.time_label}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                    Avg score: {t.avg_engagement.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Content Types */}
        <div className="card animate-fade-up">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "#ede9fe",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiImage size={15} color="#6c3bfe" />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>
              Best Content Types
            </h3>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {recs!.best_content_types.map((ct, i) => {
              const colors = TYPE_COLORS[ct.content_type] || {
                bg: "#f1f5f9",
                text: "#64748b",
              };
              const progress = (ct.avg_engagement / 100) * 100;
              return (
                <div
                  key={i}
                  style={{
                    paddingBottom: "10px",
                    borderBottom: "1px solid #eef1f7",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        background: colors.bg,
                        color: colors.text,
                        padding: "3px 8px",
                        borderRadius: "5px",
                        fontSize: "10px",
                        fontWeight: 600,
                      }}
                    >
                      {ct.content_type}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#6c3bfe",
                        marginLeft: "auto",
                      }}
                    >
                      {ct.avg_engagement.toFixed(1)}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "5px",
                      background: "#f1f5f9",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(progress, 100)}%`,
                        height: "100%",
                        background: "#6c3bfe",
                        borderRadius: "3px",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Caption Suggestions */}
      <div className="card">
        <div className="flex items-center mb-6">
          <FiEdit3 className="text-3xl text-orange-500 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Caption Writing Tips
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recs!.caption_suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-5 border border-orange-200"
            >
              <h3 className="font-semibold text-orange-900 mb-2">
                {suggestion.tip}
              </h3>

              <p className="text-sm text-gray-600 mb-2">
                <strong>Example:</strong> {suggestion.example}
              </p>

              <p className="text-xs text-gray-500 italic">
                {suggestion.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Row */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button className="btn btn-secondary" onClick={load}>
          <FiRefreshCw size={14} />
          Refresh Recommendations
        </button>
        <Link href="/predict" className="btn btn-primary">
          <FiZap size={14} />
          Predict a Post
        </Link>
      </div>
    </Layout>
  );
}
