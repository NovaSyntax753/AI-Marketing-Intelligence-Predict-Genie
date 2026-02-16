import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { predictEngagement, trainModel } from '@/lib/api';
import { FaBrain, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function Predict() {
  const [formData, setFormData] = useState({
    platform: 'instagram',
    post_type: 'image',
    posting_time: 12
  });
  const [prediction, setPrediction] = useState<any>(null);
  const [training, setTraining] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [trainResult, setTrainResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTrain = async () => {
    setTraining(true);
    setTrainResult(null);
    setError(null);

    try {
      const result = await trainModel();
      setTrainResult(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to train model');
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
      const result = await predictEngagement({
        ...formData,
        posting_time: parseInt(formData.posting_time.toString())
      });
      setPrediction(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to make prediction');
    } finally {
      setPredicting(false);
    }
  };

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Engagement Prediction</h1>
          <p className="text-gray-600">
            Predict engagement for your next post using AI
          </p>
        </div>

        {/* Train Model Section */}
        <div className="card bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Train AI Model</h3>
              <p className="text-gray-600 mb-4">
                Train the model with your marketing data before making predictions
              </p>
            </div>
            <FaBrain className="text-4xl text-purple-500" />
          </div>
          <button
            onClick={handleTrain}
            disabled={training}
            className="btn-primary disabled:opacity-50"
          >
            {training ? 'Training...' : 'Train Model'}
          </button>

          {trainResult && trainResult.success && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <FaCheckCircle className="text-green-500 text-xl mt-1 mr-3" />
                <div>
                  <h4 className="font-semibold text-green-900">Training Successful!</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Model trained on {trainResult.data_count} records
                  </p>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Training Score: {(trainResult.train_score * 100).toFixed(2)}%</p>
                    <p>Test Score: {(trainResult.test_score * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Prediction Form */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Make a Prediction</h2>

          <form onSubmit={handlePredict} className="space-y-6">
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>

            {/* Post Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select
                name="post_type"
                value={formData.post_type}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="carousel">Carousel</option>
                <option value="story">Story</option>
                <option value="reel">Reel</option>
                <option value="text">Text</option>
                <option value="link">Link</option>
              </select>
            </div>

            {/* Posting Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posting Time: {formatTime(parseInt(formData.posting_time.toString()))}
              </label>
              <input
                type="range"
                name="posting_time"
                min="0"
                max="23"
                value={formData.posting_time}
                onChange={handleInputChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>11 PM</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={predicting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {predicting ? 'Predicting...' : 'Predict Engagement'}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <FaExclamationCircle className="text-red-500 text-xl mt-1 mr-3" />
                <div>
                  <h4 className="font-semibold text-red-900">Prediction Failed</h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Prediction Result */}
        {prediction && prediction.success && (
          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Prediction Result</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-sm text-gray-600 mb-2">Predicted Engagement Rate</h3>
                <p className="text-5xl font-bold text-green-600">
                  {prediction.predicted_engagement}%
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-sm text-gray-600 mb-2">Confidence Score</h3>
                <p className="text-5xl font-bold text-blue-600">
                  {prediction.confidence_score || 85}%
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Platform</p>
                <p className="text-lg font-semibold capitalize">{prediction.platform}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Content Type</p>
                <p className="text-lg font-semibold capitalize">{prediction.post_type}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Posting Time</p>
                <p className="text-lg font-semibold">{formatTime(prediction.posting_time)}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                <strong>Interpretation:</strong> Based on historical data, a{' '}
                {prediction.post_type} post on {prediction.platform} at{' '}
                {formatTime(prediction.posting_time)} is predicted to achieve{' '}
                <strong>{prediction.predicted_engagement}%</strong> engagement rate.
              </p>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="card bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 How It Works</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
            <li>The AI model analyzes your historical marketing data</li>
            <li>It learns patterns between post characteristics and engagement</li>
            <li>Predictions are based on platform, content type, and posting time</li>
            <li>Train the model regularly with new data for better accuracy</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
