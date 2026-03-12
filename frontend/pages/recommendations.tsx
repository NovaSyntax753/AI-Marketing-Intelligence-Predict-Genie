
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getRecommendations } from '@/lib/api';
import { FaLightbulb, FaClock, FaImage, FaGlobe, FaPencilAlt, FaSpinner } from 'react-icons/fa';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const data = await getRecommendations();
      setRecommendations(data || {});
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setRecommendations({});
    } finally {
      setLoading(false);
    }
  };

  const insights = recommendations?.overall_insights || [];
  const postingTimes = recommendations?.best_posting_times || [];
  const contentTypes = recommendations?.best_content_types || [];
  const platforms = recommendations?.best_platforms || [];
  const captions = recommendations?.caption_suggestions || [];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-4xl text-primary" />
        </div>
      </Layout>
    );
  }

  if (!recommendations || insights?.[0]?.includes('Not enough data')) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Data Available</h2>
          <p className="text-gray-600 mb-6">Upload marketing data to get recommendations</p>
          <a href="/upload" className="btn-primary">Upload Data</a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Powered Recommendations
          </h1>
          <p className="text-gray-600">
            Optimize your marketing strategy with data-driven insights
          </p>
        </div>

        {/* Insights */}
        <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
          <div className="flex items-center mb-4">
            <FaLightbulb className="text-3xl text-yellow-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Key Insights</h2>
          </div>

          <div className="space-y-3">
            {insights.map((insight: string, idx: number) => (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-gray-800">
                  <span className="font-semibold text-yellow-600">• </span>
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Best Posting Times */}
        <div className="card">
          <div className="flex items-center mb-6">
            <FaClock className="text-3xl text-blue-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Best Posting Times</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {postingTimes.map((time: any, idx: number) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <div className="text-center">
                  <p className="text-sm text-blue-600 font-semibold mb-2">#{idx + 1} Best Time</p>
                  <p className="text-3xl font-bold text-blue-900 mb-2">{time.time_label}</p>
                  <p className="text-lg font-semibold text-blue-700">{time.avg_engagement}%</p>
                  <p className="text-xs text-blue-600 mt-2">avg engagement</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Content Types */}
        <div className="card">
          <div className="flex items-center mb-6">
            <FaImage className="text-3xl text-purple-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Best Content Types</h2>
          </div>

          <div className="space-y-4">
            {contentTypes.map((content: any, idx: number) => (
              <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 capitalize">
                      {content.content_type}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{content.recommendation}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-purple-600">{content.avg_engagement}%</p>
                    <p className="text-xs text-purple-600">engagement</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Platforms */}
        <div className="card">
          <div className="flex items-center mb-6">
            <FaGlobe className="text-3xl text-green-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Best Platforms</h2>
          </div>

          <div className="space-y-4">
            {platforms.map((platform: any, idx: number) => (
              <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
                <div className="flex items-center justify-between">

                  <div>
                    <h3 className="text-lg font-semibold text-green-900 capitalize">
                      {platform.platform}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{platform.recommendation}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">{platform.avg_engagement}%</p>
                    <p className="text-xs text-green-600">engagement</p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Caption Suggestions */}
        <div className="card">
          <div className="flex items-center mb-6">
            <FaPencilAlt className="text-3xl text-orange-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Caption Writing Tips</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {captions.map((suggestion: any, idx: number) => (
              <div key={idx} className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-5 border border-orange-200">

                <h3 className="font-semibold text-orange-900 mb-2">{suggestion.tip}</h3>

                <p className="text-sm text-gray-600 mb-2">
                  <strong>Example:</strong> {suggestion.example}
                </p>

                <p className="text-xs text-gray-500 italic">{suggestion.reason}</p>

              </div>
            ))}
          </div>
        </div>

        {/* Refresh */}
        <div className="text-center">
          <button
            onClick={loadRecommendations}
            className="btn-primary"
          >
            Refresh Recommendations
          </button>
        </div>

      </div>
    </Layout>
  );
}

