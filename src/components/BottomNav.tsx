import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Droplet, Activity, User } from 'lucide-react';
import './BottomNav.css';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';
  
  if (isLoginPage) return null;

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard/donor' },
    { icon: Search, label: 'Find', path: '/alert' },
    { icon: Droplet, label: 'Donate', path: '/dashboard/hospital' },
    { icon: Activity, label: 'Requests', path: '/sos' },
    { icon: User, label: 'Profile', path: '/login' }
  ];

  return (
    <div className="bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <div 
            key={item.label} 
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <div className="icon-container">
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="nav-label">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};
