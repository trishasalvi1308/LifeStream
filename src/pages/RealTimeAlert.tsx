import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BellRing, Clock, MapPin, Droplet } from 'lucide-react';

export const RealTimeAlert: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'rgba(240, 62, 62, 0.05)' }} className="animate-fade-in">
      
      <div style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
        boxShadow: 'inset 0 0 100px rgba(240, 62, 62, 0.2)', pointerEvents: 'none' 
      }} />

      <div style={{ textAlign: 'center', marginTop: 'var(--spacing-8)', marginBottom: 'var(--spacing-8)' }}>
        <div style={{ 
          display: 'inline-flex', padding: 'var(--spacing-4)', borderRadius: '50%', 
          backgroundColor: 'rgba(55, 178, 77, 0.1)', color: 'var(--color-success)',
          animation: 'pulseRed 1.5s infinite', marginBottom: 'var(--spacing-4)'
        }}>
          <BellRing size={48} />
        </div>
        <h2 style={{ color: 'var(--color-success)' }}>HOSPITAL ACCEPTED SOS</h2>
        <p style={{ color: 'var(--text-secondary)' }}>A nearby hospital has confirmed they have the blood stock.</p>
      </div>

      <Card glass style={{ borderColor: 'var(--color-success)', position: 'relative', zIndex: 1 }} className="animate-slide-up stagger-1">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <Droplet color="var(--color-primary)" />
            <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>Blood Reserved</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: 'var(--color-success)' }}>
            <Clock size={18} />
            <span style={{ fontWeight: '600' }}>Confirmed</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
          <div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: '2px' }}>Hospital Details</p>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-2)' }}>
              <MapPin size={18} color="var(--text-secondary)" style={{ marginTop: '2px' }} />
              <span>City General Hospital<br/><span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>2.4 km away</span></span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <Button 
            onClick={() => navigate('/fulfilled')} 
            style={{ height: '56px', fontSize: 'var(--text-lg)' }}
          >
            Acknowledge & Proceed
          </Button>
        </div>
      </Card>
      
    </div>
  );
};
