import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Map, Search, Heart, UserCheck } from 'lucide-react';
import { supabase } from '../config/supabase';

interface Organization {
  organization_id: string | number;
  organization_name: string;
  organization_type: 'hospital' | 'blood_bank';
  address: string | null;
  area: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface AcceptanceState {
  organization: Organization;
  simulated: true;
}

const distanceInKm = (
  first: { lat: number; lng: number },
  second: { lat: number; lng: number }
) => {
  const earthRadiusKm = 6371;
  const latitudeDifference = (second.lat - first.lat) * Math.PI / 180;
  const longitudeDifference = (second.lng - first.lng) * Math.PI / 180;
  const firstLatitude = first.lat * Math.PI / 180;
  const secondLatitude = second.lat * Math.PI / 180;
  const haversine = Math.sin(latitudeDifference / 2) ** 2
    + Math.cos(firstLatitude) * Math.cos(secondLatitude)
    * Math.sin(longitudeDifference / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

export const MatchingProcess: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let selectedOrganization: Organization | null = null;

    const loadOrganization = async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('organization_id, organization_name, organization_type, address, area, phone, latitude, longitude')
        .eq('is_active', true)
        .eq('is_verified', true)
        .in('organization_type', ['hospital', 'blood_bank']);

      if (!isMounted) return;

      if (error || !data || data.length === 0) {
        selectedOrganization = null;
        return;
      }

      const organizations = data as Organization[];
      const setSelectedOrganization = (position?: GeolocationPosition) => {
        const validOrganizations = organizations.filter(
          (organization) => organization.latitude !== null && organization.longitude !== null
        );

        if (!position || validOrganizations.length === 0) {
          selectedOrganization = organizations[0];
          return;
        }

        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        selectedOrganization = validOrganizations
          .map((organization) => ({
            organization,
            distance: distanceInKm(userLocation, {
              lat: organization.latitude as number,
              lng: organization.longitude as number
            })
          }))
          .sort((first, second) => first.distance - second.distance)[0]?.organization ?? null;
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          setSelectedOrganization,
          () => setSelectedOrganization()
        );
      } else {
        setSelectedOrganization();
      }
    };

    void loadOrganization();

    const steps = [
      setTimeout(() => setStep(1), 2000), // Scanning Geolocation
      setTimeout(() => setStep(2), 4000), // Checking Blood Compatibility
      setTimeout(() => setStep(3), 6000), // Nearest Donor Found
      setTimeout(() => navigate('/alert', {
        state: selectedOrganization ? {
          organization: selectedOrganization,
          simulated: true
        } satisfies AcceptanceState : {
          error: 'No verified organizations are currently available.',
          simulated: true
        }
      }), 8000), // Route to Real-Time Alert simulation
    ];

    return () => {
      isMounted = false;
      steps.forEach(clearTimeout);
    };
  }, [navigate]);

  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', flex: 1 }} className="animate-fade-in">
      <div style={{ marginBottom: 'var(--spacing-8)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 'var(--spacing-2)' }}>Broadcasting SOS</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Contacting nearby hospitals with blood stock.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', position: 'relative' }}>
        
        {/* Step 1 */}
        <Card glass style={{ opacity: step >= 0 ? 1 : 0.5, borderColor: step === 0 ? 'var(--color-primary)' : 'var(--color-border)' }} className={step >= 0 ? 'animate-slide-up' : ''}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
            <div style={{ padding: 'var(--spacing-2)', background: 'var(--bg-base)', borderRadius: 'var(--radius-full)' }}>
              <Map color={step >= 0 ? 'var(--color-primary)' : 'var(--text-tertiary)'} />
            </div>
            <div>
              <h4 style={{ margin: 0 }}>Geolocation Radius</h4>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Scanning hospitals within 10km...</p>
            </div>
            {step === 0 && <span className="spinner" style={spinnerStyle} />}
          </div>
        </Card>

        {/* Step 2 */}
        <Card glass style={{ opacity: step >= 1 ? 1 : 0.5, borderColor: step === 1 ? 'var(--color-primary)' : 'var(--color-border)' }} className={step >= 1 ? 'animate-slide-up' : ''}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
            <div style={{ padding: 'var(--spacing-2)', background: 'var(--bg-base)', borderRadius: 'var(--radius-full)' }}>
              <Heart color={step >= 1 ? 'var(--color-primary)' : 'var(--text-tertiary)'} />
            </div>
            <div>
              <h4 style={{ margin: 0 }}>Broadcasting Request</h4>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Sending secure SOS to hospital networks...</p>
            </div>
            {step === 1 && <span className="spinner" style={spinnerStyle} />}
          </div>
        </Card>

        {/* Step 3 */}
        <Card glass style={{ opacity: step >= 2 ? 1 : 0.5, borderColor: step === 2 ? 'var(--color-primary)' : 'var(--color-border)' }} className={step >= 2 ? 'animate-slide-up' : ''}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
            <div style={{ padding: 'var(--spacing-2)', background: 'var(--bg-base)', borderRadius: 'var(--radius-full)' }}>
              <Search color={step >= 2 ? 'var(--color-primary)' : 'var(--text-tertiary)'} />
            </div>
            <div>
              <h4 style={{ margin: 0 }}>Awaiting Acceptance</h4>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Waiting for unicast acceptance...</p>
            </div>
            {step === 2 && <span className="spinner" style={spinnerStyle} />}
          </div>
        </Card>

        {/* Success */}
        {step >= 3 && (
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-6)', color: 'var(--color-success)' }} className="animate-fade-in">
            <UserCheck size={48} style={{ margin: '0 auto', marginBottom: 'var(--spacing-2)' }} />
            <h3>Organization Selected</h3>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const spinnerStyle = {
  marginLeft: 'auto',
  width: '16px',
  height: '16px',
  border: '2px solid transparent',
  borderTopColor: 'var(--color-primary)',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};
