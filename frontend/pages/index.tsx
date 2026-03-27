import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { getDataCount, getAnalytics } from '@/lib/api'
import { FaChartLine, FaUpload, FaBrain, FaLightbulb } from 'react-icons/fa'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Types
interface AnalyticsData {
  avg_engagement_score: number
  total_posts: number
}

export default function Home() {

  const [dataCount, setDataCount] = useState(0)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      const countData = await getDataCount()
      setDataCount(countData?.total_records || 0)

      if (countData?.total_records > 0) {
        const analyticsData = await getAnalytics()
        setAnalytics(analyticsData)
      }

    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>

      <div className="flex flex-col justify-center items-center text-center min-h-[calc(100vh-220px)] space-y-10">

        {/* Header */}
        <div>
          <motion.h1
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
            className="text-5xl font-bold mb-4 
              bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 
              bg-clip-text text-transparent"
          >
            Welcome to Predict Genie
          </motion.h1>

          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-600"
          >
            AI-Powered Marketing Intelligence Platform
          </motion.p>
        </div>

        {/* Loading */}
        {/* {loading && (
          <p className="text-gray-500">Loading data...</p>
        )} */}

        {/* Error */}
        {/* {error && (
          <p className="text-red-500">{error}</p>
        )} */}

        {/* Stats */}
        {/* {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">

            <div className="card text-center">
              <FaUpload className="text-3xl mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold">Total Records</h3>
              <p className="text-2xl font-bold">{dataCount}</p>
            </div>

            <div className="card text-center">
              <FaChartLine className="text-3xl mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold">Total Posts</h3>
              <p className="text-2xl font-bold">
                {analytics?.total_posts || 0}
              </p>
            </div>

            <div className="card text-center">
              <FaBrain className="text-3xl mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold">Avg Engagement</h3>
              <p className="text-2xl font-bold">
                {analytics?.avg_engagement_score?.toFixed(2) || 0}
              </p>
            </div>

          </div>
        )} */}

        {/* Actions */}
        {/* <div className="flex gap-4 mt-6">

          <Link href="/upload" className="btn-primary flex items-center gap-2">
            <FaUpload /> Upload Data
          </Link>

          <Link href="/predict" className="btn-secondary flex items-center gap-2">
            <FaLightbulb /> Predict
          </Link>

          <Link href="/analytics" className="btn-secondary flex items-center gap-2">
            <FaChartLine /> View Analytics
          </Link>

        </div>*/}

      </div> 

    </Layout>
  )
}