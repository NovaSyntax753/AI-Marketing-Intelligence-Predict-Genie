import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json', // fixed
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
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/upload-data`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// -----------------------------
// Analytics
// -----------------------------
export const getAnalytics = () => fetchAnalytics("/analytics");
export const getPlatformComparison = () => fetchAnalytics("/analytics/platform-comparison");
export const getContentTypeAnalysis = () => fetchAnalytics("/analytics/post-type");
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
  const response = await api.post('/predict', data);
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
  const response = await api.get('/data/count');
  return response.data;
};

export const getRecentData = async (limit: number = 10) => {
  const response = await api.get(`/data/recent?limit=${limit}`);
  return response.data;
};

export default api;