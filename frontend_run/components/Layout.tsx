import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiGrid, FiUploadCloud, FiBarChart2, FiCpu, FiZap, FiMenu, FiX } from 'react-icons/fi';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  recordCount?: number;
}

const navItems = [
  { label: 'Dashboard', path: '/', icon: FiGrid },
  { label: 'Upload Data', path: '/upload', icon: FiUploadCloud },
  { label: 'Analytics', path: '/analytics', icon: FiBarChart2 },
  { label: 'Predict', path: '/predict', icon: FiCpu },
  { label: 'Recommendations', path: '/recommendations', icon: FiZap },
];

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle, recordCount = 0 }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [router.pathname]);

  return (
    <div className="app-shell">
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Link href="/" className="sidebar-logo">
          <div className="sidebar-logo-icon">PG</div>
          <div className="sidebar-logo-text">PredictGenie</div>
        </Link>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-label">Main</div>
            {navItems.slice(0, 2).map(({ label, path, icon: Icon }) => {
              const active = router.pathname === path;
              return (
                <Link
                  key={path}
                  href={path}
                  className={`sidebar-nav-item ${active ? 'active' : ''}`}
                >
                  <div className="sidebar-nav-icon">
                    <Icon size={16} />
                  </div>
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">Intelligence</div>
            {navItems.slice(2).map(({ label, path, icon: Icon }) => {
              const active = router.pathname === path;
              return (
                <Link
                  key={path}
                  href={path}
                  className={`sidebar-nav-item ${active ? 'active' : ''}`}
                >
                  <div className="sidebar-nav-icon">
                    <Icon size={16} />
                  </div>
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Model status */}
        <div className="sidebar-status">
          <div className="sidebar-status-header">
            <div className="sidebar-status-dot"></div>
            Model active
          </div>
          <div className="sidebar-status-body">Ready for predictions</div>
        </div>
      </aside>

      {/* Top Navigation Bar */}
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="lg:hidden flex items-center justify-center"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          <nav className="topbar-nav">
            {navItems.map(({ label, path }) => {
              const active = router.pathname === path;
              return (
                <Link key={path} href={path}>
                  <button className={`topbar-nav-pill ${active ? 'active' : ''}`}>
                    {label}
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="topbar-right">
          {recordCount > 0 && (
            <div className="topbar-record-count">{recordCount} records</div>
          )}
          <Link href="/upload">
            <button className="topbar-upload-btn">
              <FiUploadCloud size={12} />
              Upload
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {title && <div className="page-greeting">Good morning 👋</div>}
        {subtitle && <div className="page-subtitle">{subtitle}</div>}
        {children}
      </main>
    </div>
  );
};

export default Layout;
