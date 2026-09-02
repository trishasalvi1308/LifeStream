import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { RequestItem } from '../components/RequestItem';

export const HospitalDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ padding: 'var(--spacing-6) 0', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* Header Section */}
      <div className="stagger-1" style={{ marginBottom: 'var(--spacing-6)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--spacing-1)', color: 'var(--text-primary)', fontWeight: 700 }}>
          Hospital Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          Real time overview of blood supply and active emergencies.
        </p>
      </div>

      {/* Primary Action Button */}
      <div className="stagger-2" style={{ marginBottom: 'var(--spacing-8)' }}>
        <Button 
          variant="primary"
          onClick={() => navigate('/sos')} 
          style={{ width: '100%', maxWidth: '600px', fontSize: 'var(--text-lg)' }}
        >
          <span style={{ fontSize: '24px', marginRight: '8px', fontWeight: 'bold' }}>*</span> Create Emergency Request
        </Button>
      </div>

      {/* Stats Grid (2x2 on Mobile, 4x1 on Desktop) */}
      <div className="stagger-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
        
        {/* Active Requests */}
        <Card className="hover-lift" style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--bg-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-3)' }}>
            <Droplet size={20} color="var(--color-primary)" />
          </div>
          <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>24</span>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>ACTIVE REQUESTS</span>
        </Card>

        {/* Emergency Requests (RED) */}
        <Card className="hover-lift" style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--color-primary-light)', border: '1px solid var(--color-primary)' }}>
          <div style={{ width: '50px', height: '30px', borderRadius: '15px', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-3)', gap: '4px' }}>
             <span style={{ color: 'white', fontWeight: 800 }}>*</span> <span style={{ color: 'white', fontSize: '10px', fontWeight: 700 }}>LIVE</span>
          </div>
          <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>3</span>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>EMERGENCY REQUESTS</span>
        </Card>

        {/* Donors Responded */}
        <Card className="hover-lift" style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--bg-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-3)' }}>
            <Users size={20} color="var(--color-primary)" />
          </div>
          <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>142</span>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>DONORS RESPONDED</span>
        </Card>

        {/* Requests Fulfilled */}
        <Card className="hover-lift" style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--bg-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(55, 178, 77, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-3)' }}>
            <CheckCircle size={20} color="var(--color-success)" />
          </div>
          <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>89%</span>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>REQUESTS FULFILLED</span>
        </Card>
      </div>

      {/* Active Emergencies List */}
      <div className="stagger-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>Active Emergency<br/>Requests</h2>
          <span style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} className="hover-lift">
            View All <ArrowRight size={16} />
          </span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <RequestItem 
            id="REQ-8901"
            hospitalName="O- Negative Needed"
            bloodGroup="O-"
            units={4}
            priority="Critical"
            status="Searching"
            actionText="Assign Donor"
          />
        </div>
      </div>
    </div>
  );
};


