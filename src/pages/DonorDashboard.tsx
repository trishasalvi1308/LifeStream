import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Droplet, User, MapPin } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ActionCard } from '../components/ActionCard';

export const DonorDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ padding: 'var(--spacing-6) 0', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header Section */}
      <div className="stagger-1" style={{ marginBottom: 'var(--spacing-6)' }}>
        <h1 style={{ 
          fontSize: 'var(--text-3xl)', 
          marginBottom: 'var(--spacing-1)',
          color: 'var(--text-primary)',
          fontWeight: 700
        }}>
          Hello, Rahul
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center' }}>
          Ready to save a life today?
        </p>
      </div>

      {/* Blood Group & Status Card */}
      <Card className="stagger-2 hover-lift" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: 'var(--spacing-4) var(--spacing-6)', 
        marginBottom: 'var(--spacing-6)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 4px 12px -4px rgba(0,0,0,0.05)',
        gap: 'var(--spacing-4)',
        width: 'max-content'
      }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MapPin size={48} color="var(--color-primary)" fill="var(--color-primary)" strokeWidth={1} />
          <span style={{ position: 'absolute', top: '12px', color: 'white', fontWeight: 800, fontSize: '14px' }}>O+</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            YOUR BLOOD GROUP
          </span>
          <span style={{ fontWeight: 600, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-base)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
            Available to Donate
          </span>
        </div>
      </Card>

      {/* Primary Urgent Action */}
      <div className="stagger-3" style={{ marginBottom: 'var(--spacing-8)' }}>
        <Button 
          variant="primary"
          onClick={() => navigate('/sos')} 
          style={{ width: '100%', maxWidth: '600px', fontSize: 'var(--text-lg)' }}
        >
          <span style={{ fontSize: '24px', marginRight: '8px', fontWeight: 'bold' }}>*</span> Need Blood Urgently?
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="stagger-4">
        <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--spacing-4)' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
          <ActionCard 
            title="Find Hospitals" 
            icon={MapPin} 
            onClick={() => navigate('/search')} 
          />
          <ActionCard 
            title="Donate Blood" 
            icon={Droplet} 
            onClick={() => navigate('/alert')} 
          />
          <ActionCard 
            title="Requests" 
            icon={Droplet} /* Placeholder since Activity wasn't cleanly looking like the screenshot */
            onClick={() => navigate('/sos')} 
          />
          <ActionCard 
            title="Profile" 
            icon={User} 
            onClick={() => navigate('/profile')} 
          />
        </div>
      </div>
    </div>
  );
};
