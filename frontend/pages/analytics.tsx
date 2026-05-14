// import React, { useEffect, useState } from 'react'
// import Layout from '@/components/Layout'
// import { getAnalytics, getContentTypeAnalysis, getTimeAnalysis } from '@/lib/api'
// import {
//   BarChart, Bar, LineChart, Line,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from 'recharts'
// import { FaSpinner } from 'react-icons/fa'
// import Link from 'next/link'

// // Types
// interface Post {
//   post_type: string
//   engagement_score: number
//   likes: number
//   comments: number
//   reposts: number
// }

// interface AnalyticsData {
//   total_posts: number
//   avg_engagement_score: number
//   top_performing_posts: Post[]
//   content_type_stats: Record<string, any>
// }

// export default function Analytics() {

//   const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
//   const [contentData, setContentData] = useState<any[]>([])
//   const [timeData, setTimeData] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     loadAnalytics()
//   }, [])

//   const loadAnalytics = async () => {
//     try {
//       setLoading(true)

//       const [analyticsData, contentAnalysis, timeAnalysis] = await Promise.all([
//         getAnalytics(),
//         getContentTypeAnalysis(),
//         getTimeAnalysis()
//       ])

//       setAnalytics(analyticsData)
//       setContentData(contentAnalysis || [])
//       setTimeData(timeAnalysis || [])

//     } catch (err) {
//       console.error('Error loading analytics:', err)
//       setError('Failed to load analytics data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Loading State
//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center h-64">
//           <FaSpinner className="animate-spin text-4xl text-primary" />
//         </div>
//       </Layout>
//     )
//   }

//   // Error State
//   if (error) {
//     return (
//       <Layout>
//         <div className="text-center py-12 text-red-500">
//           {error}
//         </div>
//       </Layout>
//     )
//   }

//   // No Data State
//   if (!analytics || analytics.total_posts === 0) {
//     return (
//       <Layout>
//         <div className="text-center py-12">
//           <h2 className="text-2xl font-semibold mb-4">No Data Available</h2>
//           <p className="text-gray-600 mb-6">Upload marketing data to view analytics</p>
//           <Link href="/upload" className="btn-primary">Upload Data</Link>
//         </div>
//       </Layout>
//     )
//   }

//   // Safe content stats
//   const contentStats = Object.entries(analytics.content_type_stats || {}).map(
//     ([type, stats]: [string, any]) => ({
//       post_type: type,
//       engagement_score: stats?.engagement_score || 0,
//       likes: stats?.likes || 0
//     })
//   )

//   return (
//     <Layout>

//       <div className="space-y-8">

//         {/* Header */}
//         <div className="text-center">
//           <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
//           <p className="text-gray-600">Comprehensive insights from your marketing data</p>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//           <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
//             <h3 className="text-lg font-semibold mb-2">Total Posts</h3>
//             <p className="text-4xl font-bold">{analytics.total_posts}</p>
//           </div>

//           <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
//             <h3 className="text-lg font-semibold mb-2">Avg Engagement</h3>
//             <p className="text-4xl font-bold">
//               {analytics.avg_engagement_score?.toFixed(2)}
//             </p>
//           </div>

//           <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
//             <h3 className="text-lg font-semibold mb-2">Top Posts</h3>
//             <p className="text-4xl font-bold">
//               {analytics.top_performing_posts?.length || 0}
//             </p>
//           </div>

//         </div>

//         {/* Content Type Chart */}
//         <div className="card">
//           <h2 className="text-2xl font-semibold mb-6">Content Type Performance</h2>

//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={contentStats}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="post_type" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="engagement_score" fill="#6366f1" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Time Analysis */}
//         <div className="card">
//           <h2 className="text-2xl font-semibold mb-6">Best Posting Time</h2>

//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={timeData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="hour" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="engagement_score"
//                 stroke="#10b981"
//                 strokeWidth={2}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Top Posts Table */}
//         <div className="card">
//           <h2 className="text-2xl font-semibold mb-6">Top Performing Posts</h2>

//           <table className="min-w-full divide-y divide-gray-200">

//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium">Rank</th>
//                 <th className="px-6 py-3">Type</th>
//                 <th className="px-6 py-3">Engagement</th>
//                 {/* <th className="px-6 py-3">Likes</th>
//                 <th className="px-6 py-3">Comments</th>
//                 <th className="px-6 py-3">Reposts</th> */}
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200">

//               {(analytics.top_performing_posts || []).map((post, idx) => (
//                 <tr key={idx}>
//                   <td className="px-6 py-4">#{idx + 1}</td>
//                   <td className="px-6 py-4">{post.post_type}</td>
//                   <td className="px-6 py-4 text-green-600">{post.engagement_score}</td>
//                   {/* <td className="px-6 py-4">{post.likes}</td>
//                   <td className="px-6 py-4">{post.comments}</td>
//                   <td className="px-6 py-4">{post.reposts}</td> */}
//                 </tr>
//               ))}

//             </tbody>

//           </table>
//         </div>

//       </div>

//     </Layout>
//   )
// }




"use client"

import React, { useEffect, useState } from "react"
import Layout from "@/components/Layout"
import { getAnalytics, getTimeAnalysis } from "@/lib/api"

import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  ComposedChart,
  ScatterChart, Scatter,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Legend
} from "recharts"

import { FaSpinner } from "react-icons/fa"

// ---------------- TIME FORMAT ----------------
const formatTime = (hour: number) => {
  const suffix = hour >= 12 ? "PM" : "AM"
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h} ${suffix}`
}

// ---------------- COMPONENT ----------------
export default function Analytics() {

  const [analytics, setAnalytics] = useState<any>(null)
  const [timeData, setTimeData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)

    const [a, t] = await Promise.all([
      getAnalytics(),
      getTimeAnalysis()
    ])

    setAnalytics(a)

    setTimeData(
      (t || []).map((x: any) => ({
        time: formatTime(x.hour),
        engagement: x.engagement_score || 0
      }))
    )

    setLoading(false)
  }

  if (loading) {
    return (
      <Layout>
        <div className="h-64 flex justify-center items-center">
          <FaSpinner className="animate-spin text-3xl" />
        </div>
      </Layout>
    )
  }

  if (!analytics) return null

  // ---------------- DATA ----------------
  const contentStats = Object.entries(analytics.content_type_stats || {}).map(
    ([k, v]: any) => ({
      name: k.toUpperCase(),
      engagement: v.engagement_score || 0,
      hashtags: v.avg_hashtags || 0,
      mentions: v.avg_mentions || 0
    })
  )

  const topPosts = analytics.top_performing_posts.map((p: any, i: number) => ({
    index: i + 1,
    engagement: p.engagement_score,
    hashtags: p.hashtag_count || 0,
    mentions: p.mention_count || 0
  }))

  const bubbleData = topPosts.map((p: any) => ({
  x: p.hashtags,
  y: p.mentions,
  z: p.engagement
}))

const dualAxisData = topPosts

const scatterData = topPosts.map((p: any) => ({
  hashtags: p.hashtags,
  engagement: p.engagement
}))

  const best = [...contentStats].sort((a,b)=>b.engagement-a.engagement)[0]

  // ---------------- UI ----------------
  return (
    <Layout>
      <div className="space-y-10 px-4 py-6">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">📊 AI Analytics Engine</h1>
          <p className="text-gray-500">Complete performance intelligence system</p>
        </div>

        {/* KPI */}
        <div className="grid md:grid-cols-3 gap-4">

          <KPI title="Total Posts" value={analytics.total_posts} />
          <KPI title="Avg Engagement" value={analytics.avg_engagement_score.toFixed(2)} />
          <KPI title="Top Content" value={best?.name} />

        </div>

        {/* ⚔️ CONTENT COMPARISON */}
        <Card title="⚔️ Content Type vs Engagement">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={contentStats}>
              <CartesianGrid opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="engagement" fill="#6366f1" isAnimationActive />
            </BarChart>
          </ResponsiveContainer>

          <Insight>Shows which content type dominates engagement.</Insight>
        </Card>

        {/* ⏰ TIME */}
        <Card title="⏰ Best Posting Time (Human Readable)">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={timeData}>
              <CartesianGrid opacity={0.2} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#10b981"
                strokeWidth={3}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>

          <Insight>Peak times show when audience is most active.</Insight>
        </Card>

        {/* 📈 GROWTH */}
        <Card title="📈 Engagement Growth Curve">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={topPosts}>
              <CartesianGrid opacity={0.2} />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Area dataKey="engagement" stroke="#f59e0b" fill="#f59e0b" />
            </AreaChart>
          </ResponsiveContainer>

          <Insight>Shows improvement across posts.</Insight>
        </Card>

        {/* 📣 MENTIONS */}
        <Card title="📣 Mentions vs Engagement">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={topPosts}>
              <CartesianGrid opacity={0.2} />
              <XAxis dataKey="mentions" />
              <YAxis />
              <Tooltip />
              <Line dataKey="engagement" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>

          <Insight>Shows if tagging people improves reach.</Insight>
        </Card>

        {/* #️⃣ HASHTAGS */}
        <Card title="#️⃣ Hashtags vs Engagement">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={topPosts}>
              <CartesianGrid opacity={0.2} />
              <XAxis dataKey="hashtags" />
              <YAxis />
              <Tooltip />
              <Line dataKey="engagement" stroke="#8b5cf6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>

          <Insight>Shows impact of hashtag usage.</Insight>
        </Card>

        {/* 🫧 BUBBLE CHART */}
        <Card title="🫧 Engagement Intelligence Map">
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart>
              <CartesianGrid opacity={0.2} />
              <XAxis dataKey="x" name="hashtags" />
              <YAxis dataKey="y" name="mentions" />
              <ZAxis dataKey="z" range={[60, 400]} />
              <Tooltip />

              <Scatter data={bubbleData} fill="#6366f1" />
            </ScatterChart>
          </ResponsiveContainer>

          <Insight>Bigger bubble = higher engagement impact.</Insight>
        </Card>

        {/* ⚖️ DUAL AXIS */}
        <Card title="⚖️ Engagement vs Hashtags Impact">
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={dualAxisData}>
              <CartesianGrid opacity={0.2} />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar dataKey="hashtags" fill="#10b981" />
              <Line dataKey="engagement" stroke="#ef4444" />
            </ComposedChart>
          </ResponsiveContainer>

          <Insight>Direct comparison of effort vs result.</Insight>
        </Card>

        {/* 🔵 SCATTER MAP */}
        <Card title="🔵 Content Behavior Map">
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart>
              <CartesianGrid opacity={0.2} />
              <XAxis dataKey="hashtags" />
              <YAxis dataKey="engagement" />
              <Tooltip />

              <Scatter data={scatterData} fill="#8b5cf6" />
            </ScatterChart>
          </ResponsiveContainer>

          <Insight>Shows relationship between hashtags and engagement.</Insight>
        </Card>

      

      </div>
    </Layout>
  )
}

// ---------------- UI HELPERS ----------------
function Card({ title, children }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  )
}

function Insight({ children }: any) {
  return (
    <div className="bg-gray-100 p-3 rounded-xl text-sm text-gray-600">
      💡 {children}
    </div>
  )
}

function KPI({ title, value }: any) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  )
}

function Box({ label, count, color }: any) {
  return (
    <div className={`p-4 rounded-xl text-white ${color}`}>
      <h3 className="text-lg font-bold">{label}</h3>
      <p className="text-2xl">{count}</p>
    </div>
  )
}