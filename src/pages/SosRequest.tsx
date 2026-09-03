import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { MapPin, Droplet, Activity, ShieldAlert } from 'lucide-react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { minimalMapOptions, libraries } from '../utils/mapStyles';

export const SosRequest: React.FC = () => {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const [bloodGroup, setBloodGroup] = React.useState('');
  const [error, setError] = React.useState('');
  const [location, setLocation] = React.useState('Mumbai, Maharashtra');

  const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validBloodGroups.includes(bloodGroup.toUpperCase())) {
      setError('Invalid Blood Group');
      return;
    }
    setError('');
    navigate('/verify-hospital');
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
          {isLoaded ? (
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
              Loading Map...
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
              <Input label="Units Required" type="number" placeholder="e.g. 2" icon={Activity} required />
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
            
            <Button type="submit" className="hover-lift" style={{ 
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
