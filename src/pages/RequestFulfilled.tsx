import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CheckCircle, Navigation } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface Organization {
  organization_name: string;
  latitude: number | null;
  longitude: number | null;
}

interface AcceptanceState {
  organization?: Organization;
  simulated: true;
}

export const RequestFulfilled: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const organization = (state as AcceptanceState | null)?.organization;
  const organizationName = organization?.organization_name || 'the selected organization';
  const mapQuery = organization?.latitude != null && organization?.longitude != null
    ? `${organization.latitude},${organization.longitude}`
    : 'blood donation center';

  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }} className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
        <CheckCircle size={64} color="var(--color-success)" style={{ margin: '0 auto', marginBottom: 'var(--spacing-4)' }} className="animate-slide-up" />
        <h1 style={{ marginBottom: 'var(--spacing-2)' }} className="animate-slide-up stagger-1">Thank You!</h1>
        <p style={{ color: 'var(--text-secondary)' }} className="animate-slide-up stagger-2">You are a hero. The hospital has been notified you are on your way.</p>
      </div>

      <Card glass className="animate-slide-up stagger-3" style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: 'var(--spacing-4)' }}>Next Steps</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-6)' }}>
          Please follow {organizationName}'s instructions and have your ID ready.
        </p>
        
        <Button 
          style={{ marginBottom: 'var(--spacing-3)' }} 
          icon={Navigation}
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`, '_blank')}
        >
          Open in Maps
        </Button>
        <Button variant="secondary" onClick={() => navigate('/dashboard/donor')}>
          Return to Dashboard
        </Button>
      </Card>
    </div>
  );
};
