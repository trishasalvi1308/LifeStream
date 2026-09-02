import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { CheckCircle, ShieldCheck } from 'lucide-react';

export const HospitalVerification: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call for verification
    const timer = setTimeout(() => {
      navigate('/matching');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' }} className="animate-fade-in">
      <Card glass style={{ alignItems: 'center', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        <div style={{ 
          marginBottom: 'var(--spacing-6)',
          position: 'relative'
        }}>
          <ShieldCheck size={64} color="var(--color-primary)" className="animate-pulse" />
        </div>
        
        <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Broadcasting SOS</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Sending alert to nearby hospitals. Waiting for acceptance...</p>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-8)', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
          <div className="spinner" style={{
            width: '24px', height: '24px', border: '3px solid var(--color-border)', 
            borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite'
          }} />
        </div>
      </Card>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
