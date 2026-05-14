// import React, { useEffect, useState } from 'react'
// import Layout from '@/components/Layout'
// import { getDataCount, getAnalytics } from '@/lib/api'
// import { FaChartLine, FaUpload, FaBrain, FaLightbulb } from 'react-icons/fa'
// import Link from 'next/link'
// import { motion } from 'framer-motion'

// // Types
// interface AnalyticsData {
//   avg_engagement_score: number
//   total_posts: number
// }

// export default function Home() {

//   const [dataCount, setDataCount] = useState(0)
//   const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     loadData()
//   }, [])

//   const loadData = async () => {
//     try {
//       setLoading(true)

//       const countData = await getDataCount()
//       setDataCount(countData?.total_records || 0)

//       if (countData?.total_records > 0) {
//         const analyticsData = await getAnalytics()
//         setAnalytics(analyticsData)
//       }

//     } catch (err) {
//       console.error('Error loading data:', err)
//       setError('Failed to load dashboard data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Layout>

//       <div className="flex flex-col justify-center items-center text-center min-h-[calc(100vh-220px)] space-y-10">

//         {/* Header */}
//         <div>
//           <motion.h1
//             initial={{ scale: 0.6, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
//             className="text-5xl font-bold mb-4 
//               bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 
//               bg-clip-text text-transparent"
//           >
//             Welcome to Predict Genie
//           </motion.h1>

//           <motion.p
//             initial={{ y: 40, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//             className="text-xl text-gray-600"
//           >
//             AI-Powered Marketing Intelligence Platform
//           </motion.p>
//         </div>

        

//       </div> 

//     </Layout>
//   )
// }

import React from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaRocket, FaMagic, FaGlobe, FaPlay } from 'react-icons/fa'
import Explore from '@/components/Explore'

export default function Home() {
  return (
  <Layout>

    {/* ================= HERO SECTION ================= */}
    <section className="min-h-[40vh] flex flex-col items-center justify-center text-center px-6">

      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
      >
        Predict Genie ✨
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg md:text-xl text-gray-700 max-w-xl mb-10"
      >
        Turn your data into powerful predictions with next-gen AI intelligence.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-6"
      >
        <Link href="/upload">
          <button className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl shadow-xl hover:scale-110 transition">
            <FaRocket /> Get Started
          </button>
        </Link>

        <Link href="/analytics">
          <button className="flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 border border-indigo-600 rounded-2xl shadow-lg hover:scale-110 transition">
            <FaPlay /> Explore
          </button>
        </Link>
      </motion.div>

    </section>

    {/* ================= FEATURES SECTION ================= */}
    <section className="py-20 px-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">

        <motion.div whileHover={{ scale: 1.1 }} className="p-8 bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg text-center">
          <FaMagic className="text-4xl text-purple-500 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold">Smart Predictions</h3>
          <p className="text-gray-600 mt-2">AI models that forecast engagement instantly.</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} className="p-8 bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg text-center">
          <FaGlobe className="text-4xl text-indigo-500 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold">Market Insights</h3>
          <p className="text-gray-600 mt-2">Understand trends and audience behavior.</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} className="p-8 bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg text-center">
          <FaRocket className="text-4xl text-pink-500 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold">Growth Engine</h3>
          <p className="text-gray-600 mt-2">Boost your strategy with AI-powered actions.</p>
        </motion.div>

      </div>

    </section>

    {/* ================= ANIMATED DIVIDER ================= */}
    <section className="flex justify-center">
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: "60%", opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="h-[2px] bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 my-6"
      />
    </section>

    {/* ================= EXPLORE SECTION ================= */}
    <section className="pb-20">
      <Explore />
    </section>

  </Layout>
)
}
