import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getAnalytics, getContentTypeAnalysis, getTimeAnalysis } from '@/lib/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaSpinner } from 'react-icons/fa';

export default function Analytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [contentData, setContentData] = useState<any[]>([]);
  const [timeData, setTimeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [analyticsData, contentAnalysis, timeAnalysis] = await Promise.all([
        getAnalytics(),
        getContentTypeAnalysis(),
        getTimeAnalysis()
      ]);

      setAnalytics(analyticsData);
      setContentData(contentAnalysis.content_types);
      setTimeData(timeAnalysis.time_analysis);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-4xl text-primary" />
        </div>
      </Layout>
    );
  }

  if (!analytics || analytics.total_posts === 0) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Data Available</h2>
          <p className="text-gray-600 mb-6">Upload marketing data to view analytics</p>
          <a href="/upload" className="btn-primary">Upload Data</a>
        </div>
      </Layout>
    );
  }

  const platformData = Object.entries(analytics.platform_stats).map(([platform, stats]: [string, any]) => ({
    platform: platform.charAt(0).toUpperCase() + platform.slice(1),
    engagement: stats.engagement_rate,
    impressions: stats.impressions
  }));

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights from your marketing data</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Posts</h3>
            <p className="text-4xl font-bold">{analytics.total_posts}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Avg Engagement</h3>
            <p className="text-4xl font-bold">{analytics.avg_engagement_rate}%</p>
          </div>
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Top Posts</h3>
            <p className="text-4xl font-bold">{analytics.top_performing_posts.length}</p>
          </div>
        </div>

        {/* Platform Comparison Chart */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Platform Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="engagement" fill="#6366f1" name="Engagement Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Content Type Analysis */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Content Type Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="post_type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="engagement_rate" fill="#8b5cf6" name="Engagement Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time Analysis */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Engagement by Time of Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Engagement Rate (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="engagement_rate" stroke="#10b981" strokeWidth={2} name="Engagement Rate" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Statistics Table */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Detailed Platform Statistics</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Impressions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Likes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Comments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Shares</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(analytics.platform_stats).map(([platform, stats]: [string, any]) => (
                  <tr key={platform}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-semibold">
                      {stats.engagement_rate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stats.impressions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stats.likes.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stats.comments.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stats.shares.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Posts */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Top Performing Posts</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Likes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shares</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.top_performing_posts.map((post: any, idx: number) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      #{idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.platform}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.post_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
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
      </div>
    </Layout>
  );
}
