import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export const getPlatformComparison = async () => {
  const response = await api.get('/analytics/platform-comparison');
  return response.data;
};

export const getContentTypeAnalysis = async () => {
  const response = await api.get('/analytics/content-type');
  return response.data;
};

export const getTimeAnalysis = async () => {
  const response = await api.get('/analytics/time-analysis');
  return response.data;
};

export const trainModel = async () => {
  const response = await api.post('/train-model');
  return response.data;
};

export const predictEngagement = async (data: {
  post_type: string;
  posting_time: number;
  platform: string;
}) => {
  const response = await api.post('/predict', data);
  return response.data;
};

export const getRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};

export const getDataCount = async () => {
  const response = await api.get('/data/count');
  return response.data;
};

export const getRecentData = async (limit: number = 10) => {
  const response = await api.get(`/data/recent?limit=${limit}`);
  return response.data;
};

export default api;
