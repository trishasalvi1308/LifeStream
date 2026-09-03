import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Map, Search, Heart, UserCheck } from 'lucide-react';
import { findNearestSosOrganization, type SosOrganizationMatch } from '../lib/sosMatching';

interface SosRequestState {
  requestId: string;
  bloodGroup: string;
  latitude: number;
  longitude: number;
}

interface AcceptanceState {
  match: SosOrganizationMatch;
  sosLocation: Pick<SosRequestState, 'latitude' | 'longitude'>;
  simulated: true;
}

export const MatchingProcess: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [step, setStep] = useState(0);
  const [match, setMatch] = useState<SosOrganizationMatch | null>(null);

  useEffect(() => {
    let isMounted = true;
    const requestState = state as SosRequestState | null;
    const loadMatch = async () => {
      if (!requestState) {
        console.log('[Phase 5] match error', 'SOS request state is unavailable');
        return null;
      }

      console.log('[Phase 5] SOS request', requestState);
      const result = await findNearestSosOrganization(requestState.bloodGroup, {
        latitude: requestState.latitude,
        longitude: requestState.longitude
      });
      if (result.error) console.log('[Phase 5] match error', result.error);
      console.log('[Phase 5] eligible organizations count', result.match ? 1 : 0);
      console.log('[Phase 5] nearest match', result.match);
      if (isMounted) setMatch(result.match);
      return result.match;
    };

    const matchingPromise = loadMatch();
    const steps = [
      setTimeout(() => setStep(1), 2000), // Scanning Geolocation
      setTimeout(() => setStep(2), 4000), // Checking Blood Compatibility
      setTimeout(() => setStep(3), 6000), // Nearest Donor Found
    ];
    const navigationTimer = setTimeout(async () => {
      const nearestMatch = await matchingPromise;
      navigate('/alert', {
        state: nearestMatch && requestState ? {
          match: nearestMatch,
          sosLocation: {
            latitude: requestState.latitude,
            longitude: requestState.longitude
          },
          simulated: true
        } satisfies AcceptanceState : {
          error: 'No eligible organization has available blood stock.',
          simulated: true
        }
      });
    }, 8000);

    return () => {
      isMounted = false;
      steps.forEach(clearTimeout);
      clearTimeout(navigationTimer);
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
            <h3>{match ? 'Organization Matched' : 'No Eligible Match Yet'}</h3>
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
