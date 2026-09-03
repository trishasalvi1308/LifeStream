import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { MapPin, Droplet, Activity, ShieldAlert } from 'lucide-react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { minimalMapOptions, libraries } from '../utils/mapStyles';
import { getOrganizationsWithBloodAvailability, type BloodAvailabilityOrganization } from '../lib/bloodAvailability';
import { supabase } from '../config/supabase';

export const SosRequest: React.FC = () => {
  const navigate = useNavigate();
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const [mapAuthError, setMapAuthError] = React.useState(false);
  const [bloodGroup, setBloodGroup] = React.useState('');
  const [unitsRequired, setUnitsRequired] = React.useState('');
  const [error, setError] = React.useState('');
  const [requestStatus, setRequestStatus] = React.useState('');
  const [location, setLocation] = React.useState('Mumbai, Maharashtra');
  const [availability, setAvailability] = React.useState<BloodAvailabilityOrganization[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = React.useState(false);
  const [availabilityError, setAvailabilityError] = React.useState('');

  React.useEffect(() => {
    const windowWithMapsAuth = window as Window & { gm_authFailure?: () => void };
    windowWithMapsAuth.gm_authFailure = () => setMapAuthError(true);

    return () => {
      delete windowWithMapsAuth.gm_authFailure;
    };
  }, []);

  const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  React.useEffect(() => {
    const requestedBloodGroup = bloodGroup.trim().toUpperCase();
    if (!validBloodGroups.includes(requestedBloodGroup)) {
      setAvailability([]);
      setAvailabilityError('');
      setAvailabilityLoading(false);
      return;
    }

    let isMounted = true;
    setAvailabilityLoading(true);
    setAvailabilityError('');

    void getOrganizationsWithBloodAvailability(requestedBloodGroup).then(({ data, error: queryError }) => {
      if (!isMounted) return;
      setAvailability(data);
      setAvailabilityError(queryError?.message || '');
      setAvailabilityLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [bloodGroup]);

  const handleSos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validBloodGroups.includes(bloodGroup.toUpperCase())) {
      setError('Invalid Blood Group');
      return;
    }
    const parsedUnits = Number(unitsRequired);
    if (!Number.isInteger(parsedUnits) || parsedUnits <= 0) {
      setError('Enter a valid number of units');
      return;
    }

    setError('');
    setRequestStatus('Requesting your location...');

    if (!navigator.geolocation) {
      setRequestStatus('Location is not supported by this browser. SOS request was not sent.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setRequestStatus('Saving your SOS request...');
        const requestId = crypto.randomUUID();
        const insertPayload = {
          request_id: requestId,
          blood_group: bloodGroup.toUpperCase(),
          units_required: parsedUnits,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          status: 'pending',
          created_at: new Date().toISOString()
        };
        const insertResponse = await supabase.from('sos_requests').insert(insertPayload);
        console.log('[SOS insert debug] payload:', insertPayload);
        console.log('[SOS insert debug] response data:', insertResponse.data);
        console.log('[SOS insert debug] error object:', insertResponse.error);
        console.log('[SOS insert debug] error message:', insertResponse.error?.message);
        console.log('[SOS insert debug] error code:', insertResponse.error?.code);
        console.log('[SOS insert debug] error details:', insertResponse.error?.details);
        console.log('[SOS insert debug] error hint:', insertResponse.error?.hint);

        if (insertResponse.error) {
          setRequestStatus('Could not save the SOS request. Please try again.');
          return;
        }

        setRequestStatus('SOS request saved.');
        navigate('/verify-hospital', { state: { requestId } });
      },
      (geolocationError) => {
        const message = geolocationError.code === geolocationError.PERMISSION_DENIED
          ? 'Location permission was denied. SOS request was not sent.'
          : 'Your location could not be determined. SOS request was not sent.';
        setRequestStatus(message);
      }
    );
  };

  return (
    <div className="split-layout animate-fade-in" style={{ padding: 'var(--spacing-6) 0' }}>
      {/* Left Side: SOS Info and Large Map */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingRight: 'var(--spacing-8)' }} className="stagger-1">
        <div style={{ marginBottom: 'var(--spacing-6)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '20px', 
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #ff6b6b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulseRed 2s infinite',
            boxShadow: '0 8px 16px rgba(183,28,28,0.3)'
          }}>
            <ShieldAlert size={40} color="white" />
          </div>
          <div>
            <h2 style={{ 
              color: 'var(--color-primary)', 
              fontSize: 'var(--text-4xl)', 
              lineHeight: 1,
              background: 'linear-gradient(90deg, var(--color-primary) 0%, #ff6b6b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>
              Emergency SOS
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', fontWeight: 500 }}>Broadcast instantly to all nearby facilities.</p>
          </div>
        </div>

        {/* Map takes up remaining space on desktop */}
        <div style={{ flex: 1, minHeight: '380px', width: '100%', borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative', marginTop: 'var(--spacing-4)', border: '4px solid white', boxShadow: '0 12px 24px -8px rgba(0,0,0,0.1)' }}>
          {isLoaded && !mapAuthError && !loadError ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: 19.0760, lng: 72.8777 }}
              zoom={11}
              options={minimalMapOptions}
            >
              <Marker position={{ lat: 19.0760, lng: 72.8777 }} />
            </GoogleMap>
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {mapAuthError || loadError ? (
                <iframe
                  title="Emergency SOS location map"
                  src={`https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY || ''}&center=19.076,72.8777&zoom=11`}
                  style={{ width: '100%', height: '100%', border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : 'Loading Map...'}
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Emergency Form */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="stagger-2">
        <Card className="glass animate-slide-up" style={{ padding: 'var(--spacing-8)', background: 'rgba(255, 255, 255, 0.8)' }}>
          <form onSubmit={handleSos} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <Input 
                label="Blood Type Needed" 
                placeholder="e.g. A-, O+" 
                icon={Droplet} 
                required 
                value={bloodGroup}
                onChange={(e) => {
                  setBloodGroup(e.target.value);
                  setError('');
                }}
              />
              {error && <p style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)', marginTop: '-8px', fontWeight: 600 }}>{error}</p>}
              {bloodGroup.trim() && validBloodGroups.includes(bloodGroup.trim().toUpperCase()) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                    Available organizations
                  </p>
                  {availabilityLoading ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Checking blood availability...</p>
                  ) : availabilityError ? (
                    <p style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>Could not load blood availability: {availabilityError}</p>
                  ) : availability.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>No organizations have this blood group available.</p>
                  ) : (
                    availability.map((organization) => (
                      <div key={`${organization.organization_id}-${organization.blood_group}`} style={{ padding: 'var(--spacing-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                        <p style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{organization.organization_name}</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                          {organization.blood_group} · {organization.available_quantity} units available
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
              <Input label="Units Required" type="number" placeholder="e.g. 2" icon={Activity} required value={unitsRequired} onChange={(e) => setUnitsRequired(e.target.value)} />
              <Input 
                label="Your Location" 
                placeholder="Mumbai" 
                icon={MapPin} 
                required 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                readOnly
              />
            </div>
            {requestStatus && <p style={{ color: requestStatus.includes('not sent') || requestStatus.includes('Could not') ? 'var(--color-primary)' : 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>{requestStatus}</p>}
            
            <Button type="submit" disabled={requestStatus === 'Requesting your location...' || requestStatus === 'Saving your SOS request...'} className="hover-lift" style={{ 
              background: 'linear-gradient(90deg, var(--color-primary) 0%, #ff4757 100%)', 
              height: '60px', 
              fontSize: 'var(--text-lg)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 12px 24px -8px rgba(183, 28, 28, 0.5)',
              fontWeight: 700,
              marginTop: 'var(--spacing-2)'
            }}>
              Broadcast SOS Alert
            </Button>
            <Button variant="ghost" type="button" onClick={() => navigate(-1)} style={{ fontWeight: 600 }}>
              Cancel Emergency
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
