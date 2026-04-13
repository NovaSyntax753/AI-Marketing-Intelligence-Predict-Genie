// import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// // Axios instance
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // -----------------------------
// // Types
// // -----------------------------

// // Prediction
// export interface PredictPayload {
//   follower_count: number;
//   // post_type: string;
//   // like_count: number;
//   // comment_count: number;
//   repost_count: number;
//   hashtag_count: number;
//   mention_count: number;
//   cta_used: string;
// }

// export interface PredictionResponse {
//   predicted_engagement_score: number;
//   confidence_score: number;
// }

// // Upload
// export interface UploadResponse {
//   success: boolean;
//   message: string;
//   records_added: number;
//   total_rows: number;
// }

// // -----------------------------
// // Generic wrapper for analytics
// // -----------------------------
// const fetchAnalytics = async (endpoint: string) => {
//   try {
//     const response = await api.get(endpoint);
//     return response.data;
//   } catch (error: any) {
//     if (error.response?.status === 400) {
//       alert("No data found. Please upload CSV data first.");
//       window.location.href = "/upload";
//     } else {
//       throw error;
//     }
//   }
// };

// // -----------------------------
// // CSV Upload
// // -----------------------------
// export const uploadDataset = async (file: File): Promise<UploadResponse> => {

//   const formData = new FormData();
//   formData.append('file', file);

//   const response = await axios.post(`${API_URL}/upload-data`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });

//   return response.data;
// };

// // -----------------------------
// // Analytics
// // -----------------------------
// export const getAnalytics = () => fetchAnalytics("/analytics");
// export const getPlatformComparison = () => fetchAnalytics("/analytics/platform-comparison");
// export const getContentTypeAnalysis = () => fetchAnalytics("/analytics/post-type");
// export const getTimeAnalysis = () => fetchAnalytics("/analytics/time-analysis");

// // -----------------------------
// // Model Training
// // -----------------------------
// export const trainModel = async () => {
//   try {
//     const response = await api.post("/train-model");
//     return response.data;
//   } catch (error: any) {
//     if (error.response?.status === 400) {
//       alert(error.response.data.detail);
//     } else {
//       throw error;
//     }
//   }
// };

// // -----------------------------
// // Prediction (FIXED)
// // -----------------------------
// export const predictEngagement = async (
//   data: PredictPayload
// ): Promise<PredictionResponse> => {

//   const response = await api.post('/predict', data);
//   return response.data;
// };

// // -----------------------------
// // Recommendations
// // -----------------------------
// export const getRecommendations = () => fetchAnalytics("/recommendations");

// // -----------------------------
// // Data Management
// // -----------------------------
// export const getDataCount = async () => {
//   const response = await api.get('/data/count');
//   return response.data;
// };

// export const getRecentData = async (limit: number = 10) => {
//   const response = await api.get(`/data/recent?limit=${limit}`);
//   return response.data;
// };

// export default api;

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// -----------------------------
// TYPES
// -----------------------------

export interface PredictPayload {
  follower_count: number;
  post_type: string;
  hashtag_count: number;
  mention_count: number;
  cta_used: string;
}

export interface PredictionResponse {
  success?: boolean;
  predicted_engagement_score: number;
  confidence_score?: number;
}

export interface UploadResponse {
  success: boolean;
  records_added: number;
  total_rows: number;
}

// -----------------------------
// CSV Upload
// -----------------------------
export const uploadDataset = async (file: File): Promise<UploadResponse> => {
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
// ANALYTICS
// -----------------------------
export const getAnalytics = async () => {
  const res = await api.get("/analytics");
  return res.data;
};

export const getContentTypeAnalysis = async () => {
  const res = await api.get("/analytics/post-type");
  return res.data;
};

export const getTimeAnalysis = async () => {
  const res = await api.get("/analytics/time-analysis");
  return res.data;
};

// -----------------------------
// TRAIN MODEL
// -----------------------------
export const trainModel = async () => {
  const res = await api.post("/train-model");
  return res.data;
};

// -----------------------------
// PREDICT
// -----------------------------
export const predictEngagement = async (
  data: PredictPayload,
): Promise<PredictionResponse> => {
  const estimatedLikes = Math.max(
    0,
    Math.round(data.hashtag_count * 8 + data.mention_count * 5),
  );
  const estimatedComments = Math.max(0, Math.round(data.mention_count * 3));
  const estimatedReposts = Math.max(0, Math.round(data.hashtag_count / 2));
  const postingTime = new Date().getHours();

  // Support both backend schema variants in this workspace.
  const payload = {
    ...data,
    Followers_count: data.follower_count,
    Post_type: data.post_type,
    Likes: estimatedLikes,
    Comments: estimatedComments,
    Reposts: estimatedReposts,
    PostingTime: postingTime,
  };

  const res = await api.post("/predict", payload);
  return res.data;
};

// -----------------------------
// RECOMMENDATIONS
// -----------------------------
export const getRecommendations = async () => {
  const res = await api.get("/recommendations");
  return res.data;
};
export const getDataCount = async () => {
  const response = await api.get("/data/count");
  return response.data;
};

export const getRecentData = async (limit: number = 10) => {
  const response = await api.get(`/data/recent?limit=${limit}`);
  return response.data;
};

export default api;
