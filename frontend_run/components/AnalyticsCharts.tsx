import React from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AnalyticsChartsProps {
  contentData: Array<{
    post_type: string
    engagement_score: number
    likes: number
  }>
  timeData: Array<{
    hour: number
    engagement_score: number
    post_count?: number
  }>
}

export default function AnalyticsCharts({ contentData, timeData }: AnalyticsChartsProps) {
  return (
    <>
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6">Content Type Performance</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={contentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="post_type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="engagement_score" fill="#6366f1" name="Engagement Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="text-2xl font-semibold mb-6">Best Posting Time</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="engagement_score" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}