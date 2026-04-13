import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getAnalytics, getContentTypeAnalysis, getTimeAnalysis } from '@/lib/api';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { FiTrendingUp, FiBarChart2, FiClock, FiAward } from 'react-icons/fi';
import Link from 'next/link';

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; name?: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0f172a',
      border: '1px solid #1e293b',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '13px',
      color: 'white',
    }}>
      <div style={{ marginBottom: '4px', color: '#94a3b8', fontSize: '11px' }}>{label}</div>
      <div style={{ fontWeight: 600, color: 'white' }}>
        {Number(payload[0].value).toFixed(1)}
      </div>
    </div>
  );
};

const BAR_COLORS = ['#6c3bfe', '#8b5cf6', '#a78bfa', '#c4b5fd'];

export default function Analytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [contentData, setContentData] = useState<any[]>([]);
  const [timeData, setTimeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [a, c, t] = await Promise.all([
        getAnalytics(),
        getContentTypeAnalysis(),
        getTimeAnalysis(),
      ]);
      setAnalytics(a);
      setContentData(c || []);
      setTimeData(t || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Analytics">
        <div className="loading-screen">
          <div className="spinner" />
          Loading analytics…
        </div>
      </Layout>
    );
  }

  if (!analytics || analytics.total_posts === 0) {
    return (
      <Layout title="Analytics">
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-title">No data yet</div>
          <div className="empty-state-desc">Upload a marketing dataset to unlock charts and insights.</div>
          <Link href="/upload" className="btn btn-primary"><FiTrendingUp size={14} />Upload Dataset</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Analytics" subtitle="Deep dive into your engagement data">
      {/* Stats */}
      <div className="stat-grid animate-fade-up" style={{ marginBottom: '24px' }}>
        <div className="stat-card animate-fade-up animate-delay-1">
          <div className="stat-card-label">Total Posts</div>
          <div className="stat-card-value">{analytics.total_posts.toLocaleString()}</div>
          <div className="stat-card-delta stat-card-delta-purple">Records in dataset</div>
        </div>

        <div className="stat-card animate-fade-up animate-delay-2">
          <div className="stat-card-label">Avg Engagement</div>
          <div className="stat-card-value">{analytics.avg_engagement_score.toFixed(1)}</div>
          <div className="stat-card-delta stat-card-delta-green">Mean score</div>
        </div>

        <div className="stat-card animate-fade-up animate-delay-3">
          <div className="stat-card-label">Top Formats</div>
          <div className="stat-card-value">{contentData.length}</div>
          <div className="stat-card-delta stat-card-delta-purple">Content types</div>
        </div>

        <div className="stat-card animate-fade-up animate-delay-4">
          <div className="stat-card-label">Peak Hours</div>
          <div className="stat-card-value">{timeData.length}</div>
          <div className="stat-card-delta stat-card-delta-green">Time slots tracked</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '60% 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Content Type Bar Chart */}
        <div className="card animate-fade-up">
          <div className="card-title">Engagement by Post Type</div>
          <div className="card-subtitle">Average score per content format</div>
          {contentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={contentData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="post_type" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="engagement_score" radius={[6, 6, 0, 0]}>
                  {contentData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              No data available
            </div>
          )}
        </div>

        {/* Time Analysis Line Chart */}
        <div className="card animate-fade-up">
          <div className="card-title">Engagement by Hour</div>
          <div className="card-subtitle">Performance over 24h</div>
          {timeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={timeData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="engagement_score" stroke="#6c3bfe" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Top Posts Table */}
      {analytics.top_performing_posts && analytics.top_performing_posts.length > 0 && (
        <div className="card animate-fade-up">
          <div className="card-title">Top Performing Posts</div>
          <div className="card-subtitle">Ranked by engagement score</div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Type</th>
                  <th>Score</th>
                  <th>Likes</th>
                  <th>Comments</th>
                  <th>Reposts</th>
                </tr>
              </thead>
              <tbody>
                {analytics.top_performing_posts.slice(0, 10).map((post: any, i: number) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: '#6c3bfe' }}>{i + 1}</td>
                    <td><span className={`pill pill-${post.post_type}`}>{post.post_type}</span></td>
                    <td className="table-score">{post.engagement_score.toFixed(1)}</td>
                    <td>{post.likes}</td>
                    <td>{post.comments}</td>
                    <td>{post.reposts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
