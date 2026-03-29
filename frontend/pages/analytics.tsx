import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { getAnalytics, getContentTypeAnalysis, getTimeAnalysis } from '@/lib/api'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { FaSpinner } from 'react-icons/fa'
import Link from 'next/link'

// Types
interface Post {
  post_type: string
  engagement_score: number
  likes: number
  comments: number
  reposts: number
}

interface AnalyticsData {
  total_posts: number
  avg_engagement_score: number
  top_performing_posts: Post[]
  content_type_stats: Record<string, any>
}

export default function Analytics() {

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [contentData, setContentData] = useState<any[]>([])
  const [timeData, setTimeData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)

      const [analyticsData, contentAnalysis, timeAnalysis] = await Promise.all([
        getAnalytics(),
        getContentTypeAnalysis(),
        getTimeAnalysis()
      ])

      setAnalytics(analyticsData)
      setContentData(contentAnalysis || [])
      setTimeData(timeAnalysis || [])

    } catch (err) {
      console.error('Error loading analytics:', err)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  // Loading State
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-4xl text-primary" />
        </div>
      </Layout>
    )
  }

  // Error State
  if (error) {
    return (
      <Layout>
        <div className="text-center py-12 text-red-500">
          {error}
        </div>
      </Layout>
    )
  }

  // No Data State
  if (!analytics || analytics.total_posts === 0) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No Data Available</h2>
          <p className="text-gray-600 mb-6">Upload marketing data to view analytics</p>
          <Link href="/upload" className="btn-primary">Upload Data</Link>
        </div>
      </Layout>
    )
  }

  // Safe content stats
  const contentStats = Object.entries(analytics.content_type_stats || {}).map(
    ([type, stats]: [string, any]) => ({
      post_type: type,
      engagement_score: stats?.engagement_score || 0,
      likes: stats?.likes || 0
    })
  )

  return (
    <Layout>

      <div className="space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights from your marketing data</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Posts</h3>
            <p className="text-4xl font-bold">{analytics.total_posts}</p>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Avg Engagement</h3>
            <p className="text-4xl font-bold">
              {analytics.avg_engagement_score?.toFixed(2)}
            </p>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Top Posts</h3>
            <p className="text-4xl font-bold">
              {analytics.top_performing_posts?.length || 0}
            </p>
          </div>

        </div>

        {/* Content Type Chart */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Content Type Performance</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contentStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="post_type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="engagement_score" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time Analysis */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Best Posting Time</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="engagement_score"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Posts Table */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Top Performing Posts</h2>

          <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium">Rank</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Engagement</th>
                {/* <th className="px-6 py-3">Likes</th>
                <th className="px-6 py-3">Comments</th>
                <th className="px-6 py-3">Reposts</th> */}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">

              {(analytics.top_performing_posts || []).map((post, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4">#{idx + 1}</td>
                  <td className="px-6 py-4">{post.post_type}</td>
                  <td className="px-6 py-4 text-green-600">{post.engagement_score}</td>
                  {/* <td className="px-6 py-4">{post.likes}</td>
                  <td className="px-6 py-4">{post.comments}</td>
                  <td className="px-6 py-4">{post.reposts}</td> */}
                </tr>
              ))}

            </tbody>

          </table>
        </div>

      </div>

    </Layout>
  )
}