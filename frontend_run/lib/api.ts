import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json", // fixed
  },
});

// -----------------------------
// Generic wrapper for analytics endpoints
// -----------------------------
const fetchAnalytics = async (endpoint: string) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      alert("No data found. Please upload CSV data first.");
      window.location.href = "/upload"; // redirect to CSV upload page
    } else {
      throw error;
    }
  }
};

// -----------------------------
// CSV Upload
// -----------------------------
export const uploadDataset = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_URL}/upload-data`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// -----------------------------
// Analytics
// -----------------------------
export const getAnalytics = () => fetchAnalytics("/analytics");
export const getPlatformComparison = () =>
  fetchAnalytics("/analytics/platform-comparison");
export const getContentTypeAnalysis = () =>
  fetchAnalytics("/analytics/post-type");
export const getTimeAnalysis = () => fetchAnalytics("/analytics/time-analysis");

// -----------------------------
// Model Training
// -----------------------------
export const trainModel = async () => {
  try {
    const response = await api.post("/train-model");
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      alert(error.response.data.detail);
    } else {
      throw error;
    }
  }
};

// -----------------------------
// Prediction
// -----------------------------
export const predictEngagement = async (data: {
  Followers_count: number;
  Post_type: string;
  Likes: number;
  Comments: number;
  Reposts: number;
  PostingTime: number; // new key to match backend
}) => {
  const d = data as {
    follower_count?: number;
    post_type?: string;
    hashtag_count?: number;
    mention_count?: number;
    cta_used?: string;
    Followers_count?: number;
    Post_type?: string;
    Likes?: number;
    Comments?: number;
    Reposts?: number;
    PostingTime?: number;
  };

  const followerCount = d.follower_count ?? d.Followers_count ?? 0;
  const postType = d.post_type ?? d.Post_type ?? "image";
  const hashtagCount = d.hashtag_count ?? 0;
  const mentionCount = d.mention_count ?? 0;
  const likes =
    d.Likes ?? Math.max(0, Math.round(hashtagCount * 8 + mentionCount * 5));
  const comments = d.Comments ?? Math.max(0, Math.round(mentionCount * 3));
  const reposts = d.Reposts ?? Math.max(0, Math.round(hashtagCount / 2));
  const postingTime = d.PostingTime ?? new Date().getHours();

  // Support both backend schema variants in this workspace.
  const payload = {
    follower_count: followerCount,
    post_type: postType,
    hashtag_count: hashtagCount,
    mention_count: mentionCount,
    cta_used: d.cta_used ?? "yes",
    Followers_count: followerCount,
    Post_type: postType,
    Likes: likes,
    Comments: comments,
    Reposts: reposts,
    PostingTime: postingTime,
  };

  const response = await api.post("/predict", payload);
  return response.data;
};

// -----------------------------
// Recommendations
// -----------------------------
export const getRecommendations = () => fetchAnalytics("/recommendations");

// -----------------------------
// Data Management
// -----------------------------
export const getDataCount = async () => {
  const response = await api.get("/data/count");
  return response.data;
};

export const getRecentData = async (limit: number = 10) => {
  const response = await api.get(`/data/recent?limit=${limit}`);
  return response.data;
};

export default api;
