import { motion } from 'framer-motion'

export default function Explore() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-24 max-w-5xl mx-auto text-center px-6"
    >
      <h2 className="text-3xl font-bold mb-6">
        Why Choose Predict Genie?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-10">
        Predict Genie is built to bridge the gap between raw data and real business decisions.
        Instead of spending hours analyzing spreadsheets, our AI engine delivers clear insights,
        predictions, and recommendations instantly.
      </p>

      <div className="grid md:grid-cols-3 gap-6 text-left">
        
        <div className="p-6 bg-white/70 backdrop-blur rounded-2xl shadow">
          <h3 className="font-semibold text-lg mb-2">⚡ Fast Insights</h3>
          <p className="text-sm text-gray-600">
            Get instant analytics without complex setup or manual work.
          </p>
        </div>

        <div className="p-6 bg-white/70 backdrop-blur rounded-2xl shadow">
          <h3 className="font-semibold text-lg mb-2">🧠 AI Predictions</h3>
          <p className="text-sm text-gray-600">
            Predict engagement, trends, and outcomes using smart models.
          </p>
        </div>

        <div className="p-6 bg-white/70 backdrop-blur rounded-2xl shadow">
          <h3 className="font-semibold text-lg mb-2">🚀 Growth Focused</h3>
          <p className="text-sm text-gray-600">
            Focus on actions that actually improve your marketing performance.
          </p>
        </div>

      </div>
    </motion.div>
  )
}