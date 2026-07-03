import { Link, useLocation } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';
import './Header.css';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" className="logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">MindFlow</span>
        </Link>
        <nav className="header-nav">
          {isHome && (
            <Link to="/write" className="btn-write" title="记录新的念头">
              <Plus size={20} />
              <span className="btn-label">记录</span>
            </Link>
          )}
          <Link to="/settings" className="btn-icon" title="设置">
            <Settings size={18} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
