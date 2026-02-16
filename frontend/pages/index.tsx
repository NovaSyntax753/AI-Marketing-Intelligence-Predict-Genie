import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getDataCount, getAnalytics } from '@/lib/api';
import { FaChartLine, FaUpload, FaBrain, FaLightbulb } from 'react-icons/fa';
import Link from 'next/link';

export default function Home() {
  const [dataCount, setDataCount] = useState(0);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const countData = await getDataCount();
      setDataCount(countData.total_records);
      
      if (countData.total_records > 0) {
        const analyticsData = await getAnalytics();
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Predict Genie
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered Marketing Intelligence Platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Posts</p>
                <p className="text-3xl font-bold mt-2">{dataCount}</p>
              </div>
              <FaChartLine className="text-4xl text-white/50" />
            </div>
          </div>

          {analytics && (
            <>
              <div className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Avg Engagement</p>
                    <p className="text-3xl font-bold mt-2">
                      {analytics.avg_engagement_rate}%
                    </p>
                  </div>
                  <FaChartLine className="text-4xl text-white/50" />
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Platforms</p>
                    <p className="text-3xl font-bold mt-2">
                      {Object.keys(analytics.platform_stats).length}
                    </p>
                  </div>
                  <FaChartLine className="text-4xl text-white/50" />
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Content Types</p>
                    <p className="text-3xl font-bold mt-2">
                      {Object.keys(analytics.content_type_stats).length}
                    </p>
                  </div>
                  <FaChartLine className="text-4xl text-white/50" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/upload">
            <div className="card hover:shadow-xl transition-shadow cursor-pointer">
              <FaUpload className="text-4xl text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upload Data</h3>
              <p className="text-gray-600">
                Upload your marketing dataset to get started
              </p>
            </div>
          </Link>

          <Link href="/analytics">
            <div className="card hover:shadow-xl transition-shadow cursor-pointer">
              <FaChartLine className="text-4xl text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">
                View detailed insights and performance metrics
              </p>
            </div>
          </Link>

          <Link href="/predict">
            <div className="card hover:shadow-xl transition-shadow cursor-pointer">
              <FaBrain className="text-4xl text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Predict</h3>
              <p className="text-gray-600">
                Predict engagement for your next post
              </p>
            </div>
          </Link>

          <Link href="/recommendations">
            <div className="card hover:shadow-xl transition-shadow cursor-pointer">
              <FaLightbulb className="text-4xl text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Recommendations</h3>
              <p className="text-gray-600">
                Get AI-powered marketing recommendations
              </p>
            </div>
          </Link>
        </div>

        {/* Getting Started */}
        {dataCount === 0 && (
          <div className="card bg-blue-50 border border-blue-200">
            <h3 className="text-xl font-semibold mb-4 text-blue-900">
              🚀 Getting Started
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Upload your marketing data CSV file</li>
              <li>View analytics and insights from your data</li>
              <li>Train the AI model with your data</li>
              <li>Get predictions and recommendations</li>
            </ol>
            <Link href="/upload">
              <button className="btn-primary mt-4">Upload Your First Dataset</button>
            </Link>
          </div>
        )}

        {/* Top Performing Posts */}
        {analytics && analytics.top_performing_posts.length > 0 && (
          <div className="card">
            <h3 className="text-2xl font-semibold mb-4">Top Performing Posts</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Engagement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Likes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Comments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Shares
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.top_performing_posts.slice(0, 5).map((post: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.platform}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.post_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">
                        {post.engagement_rate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.likes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.comments}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.shares}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
