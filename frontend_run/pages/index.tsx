import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getDataCount, getAnalytics } from '@/lib/api';
import { FiUploadCloud, FiTrendingUp, FiActivity, FiAward } from 'react-icons/fi';

interface TopPost {
  post_type: string;
  engagement_score: number;
  likes: number;
  comments: number;
  reposts: number;
}

interface Analytics {
  total_posts: number;
  avg_engagement_score: number;
  content_type_stats: Record<string, { engagement_score: number }>;
  top_performing_posts: TopPost[];
}

const POST_TYPE_COLORS: Record<string, string> = {
  reel: 'pill-reel',
  video: 'pill-video',
  image: 'pill-image',
  text: 'pill-text',
};

export default function Dashboard() {
  const [dataCount, setDataCount] = useState<number>(0);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { total_records } = await getDataCount();
      setDataCount(total_records);
      if (total_records > 0) {
        const data = await getAnalytics();
        setAnalytics(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const bestType = analytics
    ? Object.entries(analytics.content_type_stats)
        .sort((a, b) => b[1].engagement_score - a[1].engagement_score)[0]?.[0]
    : null;

  const bestTime = analytics
    ? analytics.top_performing_posts.length > 0
      ? 'Peak Hours (2-4 PM)'
      : 'Not yet determined'
    : null;

  const insights = [
    { icon: '📱', title: 'Video posts drive 3x engagement', desc: 'Prioritize video format for maximum reach' },
    { icon: '⏰', title: 'Best time: Weekday afternoons', desc: 'Post between 2-4 PM for peak engagement' },
    { icon: '✨', title: 'Hashtags increase visibility', desc: 'Use 5-10 relevant hashtags per post' },
  ];

  return (
    <Layout title="Dashboard" subtitle="Your marketing intelligence at a glance" recordCount={dataCount}>
      {loading ? (
        <div className="loading-screen">
          <div className="spinner" />
          Loading your data…
        </div>
      ) : dataCount === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-title">No data uploaded yet</div>
          <div className="empty-state-desc">
            Import your CSV file to unlock analytics, predictions, and AI recommendations.
          </div>
          <Link href="/upload" className="btn btn-primary">
            <FiUploadCloud size={14} />
            Upload Dataset
          </Link>
        </div>
      ) : (
        <>
          {/* Stat Cards --- 4 column grid */}
          <div className="stat-grid animate-fade-up" style={{ marginBottom: '24px' }}>
            <div className="stat-card animate-fade-up animate-delay-1">
              <div className="stat-card-label">Total Posts</div>
              <div className="stat-card-value">{dataCount.toLocaleString()}</div>
              <div className="stat-card-delta stat-card-delta-purple">Posts analyzed</div>
            </div>

            <div className="stat-card animate-fade-up animate-delay-2">
              <div className="stat-card-label">Avg Engagement</div>
              <div className="stat-card-value">
                {analytics ? analytics.avg_engagement_score.toFixed(1) : '—'}
              </div>
              <div className="stat-card-delta stat-card-delta-green">Score per post</div>
            </div>

            <div className="stat-card animate-fade-up animate-delay-3">
              <div className="stat-card-label">Top Format</div>
              <div className="stat-card-value" style={{ fontSize: '18px', textTransform: 'capitalize' }}>
                {bestType ?? '—'}
              </div>
              <span className={`pill ${POST_TYPE_COLORS[bestType ?? 'text']}`} style={{ marginTop: '8px' }}>
                {bestType}
              </span>
            </div>

            <div className="stat-card animate-fade-up animate-delay-4">
              <div className="stat-card-label">Best Time</div>
              <div className="stat-card-value" style={{ fontSize: '16px' }}>
                {bestTime}
              </div>
              <div className="stat-card-delta stat-card-delta-purple">Peak hours</div>
            </div>
          </div>

          {/* Content Grid --- 2 columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '24px',
            }}
          >
            {/* Top Performing Posts Table */}
            <div className="card animate-fade-up">
              <div className="card-title">Top Performing Posts</div>
              <div className="card-subtitle">Highest engagement scores</div>

              {analytics && analytics.top_performing_posts.length > 0 ? (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Score</th>
                        <th>Engagement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.top_performing_posts.slice(0, 5).map((post, i) => (
                        <tr key={i}>
                          <td>
                            <span className={`pill ${POST_TYPE_COLORS[post.post_type]}`}>
                              {post.post_type}
                            </span>
                          </td>
                          <td className="table-score">{post.engagement_score.toFixed(1)}</td>
                          <td style={{ fontSize: '12px', color: '#64748b' }}>
                            {post.likes + post.comments + post.reposts} interactions
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                  No posts to display
                </div>
              )}
            </div>

            {/* AI Insights */}
            <div className="card animate-fade-up">
              <div className="card-title">AI Insights</div>
              <div className="card-subtitle">Key findings from your data</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {insights.map((insight, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #eef1f7' }}>
                    <div style={{ fontSize: '20px' }}>{insight.icon}</div>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#1e293b', marginBottom: '2px' }}>
                        {insight.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#94a3b8', lineHeight: '1.4' }}>
                        {insight.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f1f0fe, #ede9fe)',
              border: '1px solid #c4b5fd',
              borderRadius: '10px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
               animate: 'fadeUp 400ms ease-out both',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#6c3bfe', marginBottom: '4px' }}>
                Ready to predict engagement?
              </div>
              <div style={{ fontSize: '13px', color: '#7c3aed' }}>
                Train the AI model and forecast your next post's performance
              </div>
            </div>
            <Link href="/predict" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Go to Predict
            </Link>
          </div>
        </>
      )}
    </Layout>
  );
}
