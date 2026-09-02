import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Map, Search, Heart, UserCheck } from 'lucide-react';

export const MatchingProcess: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const steps = [
      setTimeout(() => setStep(1), 2000), // Scanning Geolocation
      setTimeout(() => setStep(2), 4000), // Checking Blood Compatibility
      setTimeout(() => setStep(3), 6000), // Nearest Donor Found
      setTimeout(() => navigate('/alert'), 8000), // Route to Real-Time Alert simulation
    ];

    return () => steps.forEach(clearTimeout);
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
            <h3>Hospital Responded!</h3>
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
