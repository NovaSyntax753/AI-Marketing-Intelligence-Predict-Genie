import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getRecommendations } from '@/lib/api';
import { FaLightbulb, FaClock, FaImage, FaPencilAlt, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

// Types
interface RecommendationData {
  best_cta: {
    cta: string;
    predicted_engagement: number;
  }[];
  overall_insights: string[];
  best_posting_times: { time_label: string; avg_engagement: number }[];
  best_content_types: { content_type: string; recommendation: string; avg_engagement: number }[];

  // 🔥 Gemini captions format
  caption_suggestions: {
    caption: string;
  }[];
}

export default function Recommendations() {

  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await getRecommendations();
      setRecommendations(data || null);
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const insights = recommendations?.overall_insights || [];
  const postingTimes = recommendations?.best_posting_times || [];
  const contentTypes = recommendations?.best_content_types || [];
  const captions = recommendations?.caption_suggestions || [];
  const ctas = recommendations?.best_cta || [];

  // Loading
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-4xl text-primary" />
        </div>
      </Layout>
    );
  }

  // Error
  if (error) {
    return (
      <Layout>
        <div className="text-center py-12 text-red-500">
          {error}
        </div>
      </Layout>
    );
  }

  // No Data
  if (!recommendations || insights?.[0]?.includes('Not enough data')) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No Data Available</h2>
          <p className="text-gray-600 mb-6">Upload marketing data to get recommendations</p>
          <Link href="/upload" className="btn-primary">Upload Data</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            AI-Powered Recommendations
          </h1>
          <p className="text-gray-600">
            Optimize your marketing strategy with data-driven insights
          </p>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
            <div className="flex items-center mb-4">
              <FaLightbulb className="text-3xl text-yellow-500 mr-3" />
              <h2 className="text-2xl font-semibold">Key Insights</h2>
            </div>

            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                  <p>
                    <span className="font-semibold text-yellow-600">• </span>
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posting Times */}
        {postingTimes.length > 0 && (
          <div className="card">
            <div className="flex items-center mb-6">
              <FaClock className="text-3xl text-blue-500 mr-3" />
              <h2 className="text-2xl font-semibold">Best Posting Times</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {postingTimes.map((time, idx) => (
                <div key={idx} className="bg-blue-50 rounded-lg p-6 border">
                  <div className="text-center">
                    <p className="text-sm font-semibold mb-2">#{idx + 1} Best Time</p>
                    <p className="text-2xl font-bold">{time.time_label}</p>
                    <p className="text-lg">{time.avg_engagement.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {ctas.length > 0 && (
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Best CTA</h2>

            {ctas.map((cta, idx) => (
              <div key={idx} className="bg-green-50 rounded-lg p-5 border mb-3">
                <h3 className="font-semibold capitalize">{cta.cta}</h3>
              </div>
            ))}
          </div>
        )}

        {/* Content Types */}
        {contentTypes.length > 0 && (
          <div className="card">
            <div className="flex items-center mb-6">
              <FaImage className="text-3xl text-purple-500 mr-3" />
              <h2 className="text-2xl font-semibold">Best Content Types</h2>
            </div>

            {contentTypes.map((content, idx) => (
              <div key={idx} className="bg-purple-50 rounded-lg p-5 border mb-3">
                <h3 className="font-semibold capitalize">{content.content_type}</h3>
                <p className="text-sm">{content.recommendation}</p>
                <p className="text-xs font-bold mt-2">
                  {content.avg_engagement.toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 🔥 GEMINI CAPTIONS */}
        {captions.length > 0 && (
          <div className="card">
            <div className="flex items-center mb-6">
              <FaPencilAlt className="text-3xl text-orange-500 mr-3" />
              <h2 className="text-2xl font-semibold"> Captions Tips</h2>
            </div>

            <div className="space-y-4">
              {captions.map((c, idx) => (
                <div key={idx} className="bg-orange-50 p-5 rounded-lg border">
                  <p className="whitespace-pre-line">{c.caption}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

