import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BellRing, Clock, MapPin, Droplet } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { EmergencyGeofence } from '../components/EmergencyGeofence';
import type { SosOrganizationMatch } from '../lib/sosMatching';

interface AcceptanceState {
  match?: SosOrganizationMatch;
  sosLocation?: { latitude: number; longitude: number };
  error?: string;
  notificationRecorded: boolean;
  notificationError?: string;
  fallbackActivated: boolean;
  simulated: true;
}

export const RealTimeAlert: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const acceptance = state as AcceptanceState | null;
  const organization = acceptance?.match;
  const error = acceptance?.error;
  const notificationRecorded = acceptance?.notificationRecorded;
  const notificationError = acceptance?.notificationError;
  const fallbackActivated = acceptance?.fallbackActivated;

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
        <h2 style={{ color: 'var(--color-success)' }}>SOS ORGANIZATION SELECTED</h2>
        <p style={{ color: 'var(--text-secondary)' }}>This is a simulated organization selection, not a real acceptance.</p>
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
          {fallbackActivated ? (
            <div>
              <p style={{ color: 'var(--color-primary)', fontWeight: 700 }}>No eligible organization found.</p>
              <p style={{ color: 'var(--text-secondary)' }}>Emergency donor fallback activated.</p>
            </div>
          ) : notificationRecorded ? (
            <p style={{ color: 'var(--color-success)', fontWeight: 700 }}>Emergency notification sent to the matched organization</p>
          ) : notificationError ? (
            <p style={{ color: 'var(--text-secondary)' }}>Match found, but the emergency notification could not be recorded.</p>
          ) : null}
          {organization && acceptance?.sosLocation && <EmergencyGeofence sosLocation={acceptance.sosLocation} organization={organization} />}
          <div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: '2px' }}>Organization Details</p>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-2)' }}>
              <MapPin size={18} color="var(--text-secondary)" style={{ marginTop: '2px' }} />
              <span>
                {error || organization?.organization_name || 'No eligible organization was matched'}
                {organization && <>
                  <br /><span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    {organization.organization_type === 'blood_bank' ? 'Blood Bank' : 'Hospital'}
                    {` · ${organization.blood_group} · ${organization.available_quantity} units · ${organization.distance_km.toFixed(1)} km away`}
                    {organization.address && ` · ${organization.address}`}
                    {organization.area && ` · ${organization.area}`}
                    {organization.phone && ` · ${organization.phone}`}
                  </span>
                </>}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <Button 
            onClick={() => navigate('/fulfilled', { state: acceptance })} 
            style={{ height: '56px', fontSize: 'var(--text-lg)' }}
          >
            Acknowledge & Proceed
          </Button>
        </div>
      </Card>
      
    </div>
  );
};
