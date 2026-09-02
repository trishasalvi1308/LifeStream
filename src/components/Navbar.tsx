import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeartPulse, User } from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  return (
    <nav style={{
      width: '100%',
      padding: 'var(--spacing-4) var(--spacing-6)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', cursor: 'pointer' }}
        onClick={() => navigate(isLoginPage ? '/login' : '/sos')}
      >
        <HeartPulse size={28} color="var(--color-primary)" />
        <span style={{ 
          fontFamily: 'var(--font-heading)', 
          fontWeight: 700, 
          fontSize: 'var(--text-xl)',
          color: 'var(--text-primary)'
        }}>
          LifeStream
        </span>
      </div>

      {!isLoginPage && (
        <div className="desktop-only" style={{ gap: 'var(--spacing-6)', alignItems: 'center' }}>
          <span onClick={() => navigate('/dashboard/donor')} style={{ cursor: 'pointer', fontWeight: 600, color: location.pathname === '/dashboard/donor' ? 'var(--color-primary)' : 'var(--text-secondary)' }}>Home</span>
          <span onClick={() => navigate('/alert')} style={{ cursor: 'pointer', fontWeight: 600, color: location.pathname === '/alert' ? 'var(--color-primary)' : 'var(--text-secondary)' }}>Find</span>
          <span onClick={() => navigate('/dashboard/hospital')} style={{ cursor: 'pointer', fontWeight: 600, color: location.pathname === '/dashboard/hospital' ? 'var(--color-primary)' : 'var(--text-secondary)' }}>Donate</span>
          <span onClick={() => navigate('/sos')} style={{ cursor: 'pointer', fontWeight: 600, color: location.pathname === '/sos' ? 'var(--color-primary)' : 'var(--text-secondary)' }}>Requests</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
        {!isLoginPage && (
          <>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/sos')}
              style={{ padding: '8px 16px', fontSize: 'var(--text-sm)' }}
            >
              Request Blood
            </Button>
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '1px solid var(--color-border)'
              }}
              onClick={() => navigate('/login')}
              title="Profile / Logout"
            >
              <User size={20} color="var(--text-secondary)" />
            </div>
          </>
        )}
      </div>
    </nav>
  );
};
