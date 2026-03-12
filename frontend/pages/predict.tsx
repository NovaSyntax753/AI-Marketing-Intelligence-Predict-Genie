import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { predictEngagement, trainModel } from '@/lib/api';
import { FaBrain, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function Predict() {

  const [formData, setFormData] = useState({
    Followers_count: 1000,
    Post_type: 'image',
    Likes: 100,
    Comments: 10,
    Reposts: 5
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [training, setTraining] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [trainResult, setTrainResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "Post_type" ? value : Number(value)
    });

  };

  const handleTrain = async () => {

    setTraining(true);
    setError(null);
    setTrainResult(null);

    try {

      const result = await trainModel();
      setTrainResult(result || {});

    } catch (err: any) {

      setError(err?.response?.data?.detail || 'Failed to train model');

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
        Followers_count: formData.Followers_count,
        Post_type: formData.Post_type,
        Likes: formData.Likes,
        Comments: formData.Comments,
        Reposts: formData.Reposts
      });

      setPrediction(result || {});

    } catch (err: any) {

      setError(err?.response?.data?.detail || 'Prediction failed');

    } finally {

      setPredicting(false);

    }

  };

  return (

    <Layout>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* Title */}

        <div className="text-center">

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Engagement Prediction
          </h1>

          <p className="text-gray-600">
            Predict engagement score using the trained AI model
          </p>

        </div>

        {/* Train Model */}

        <div className="card bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">

          <div className="flex items-start justify-between">

            <div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Train AI Model
              </h3>

              <p className="text-gray-600 mb-4">
                Train the model using your uploaded dataset
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

          {trainResult?.success && (

            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">

              <div className="flex items-start">

                <FaCheckCircle className="text-green-500 text-xl mt-1 mr-3" />

                <div>

                  <h4 className="font-semibold text-green-900">
                    Training Successful
                  </h4>

                  <p className="text-sm text-green-700 mt-1">
                    Model trained on {trainResult?.data_count || 0} records
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>

        {/* Prediction Form */}

        <div className="card">

          <h2 className="text-2xl font-semibold mb-6">
            Predict Engagement Score
          </h2>

          <form onSubmit={handlePredict} className="space-y-6">

            {/* Followers */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Followers Count
              </label>

              <input
                type="number"
                name="Followers_count"
                value={formData.Followers_count}
                onChange={handleInputChange}
                className="input-field"
              />

            </div>

            {/* Post Type */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Type
              </label>

              <select
                name="Post_type"
                value={formData.Post_type}
                onChange={handleInputChange}
                className="input-field"
              >

                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="reel">Reel</option>
                <option value="text">Text</option>

              </select>

            </div>

            {/* Likes */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Likes
              </label>

              <input
                type="number"
                name="Likes"
                value={formData.Likes}
                onChange={handleInputChange}
                className="input-field"
              />

            </div>

            {/* Comments */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments
              </label>

              <input
                type="number"
                name="Comments"
                value={formData.Comments}
                onChange={handleInputChange}
                className="input-field"
              />

            </div>

            {/* Reposts */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reposts
              </label>

              <input
                type="number"
                name="Reposts"
                value={formData.Reposts}
                onChange={handleInputChange}
                className="input-field"
              />

            </div>

            <button
              type="submit"
              disabled={predicting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {predicting ? 'Predicting...' : 'Predict Engagement'}
            </button>

          </form>

          {error && (

            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">

              <div className="flex items-start">

                <FaExclamationCircle className="text-red-500 text-xl mt-1 mr-3" />

                <div>

                  <h4 className="font-semibold text-red-900">
                    Prediction Failed
                  </h4>

                  <p className="text-sm text-red-700 mt-1">
                    {error}
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>

        {/* Prediction Result */}

        {prediction?.success && (

          <div className="card bg-green-50 border-2 border-green-300">

            <h2 className="text-2xl font-semibold mb-4">
              Prediction Result
            </h2>

            <div className="bg-white rounded-lg p-6">

              <h3 className="text-sm text-gray-600 mb-2">
                Predicted Engagement Score
              </h3>

              <p className="text-5xl font-bold text-green-600">
                {prediction?.predicted_engagement || 0}
              </p>

            </div>

          </div>

        )}

      </div>

    </Layout>

  );

}

