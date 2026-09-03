import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { User, Droplet, MapPin, Phone } from 'lucide-react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { minimalMapOptions, libraries } from '../utils/mapStyles';

export const DonorRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const [formData, setFormData] = useState({
    fullName: '',
    bloodGroup: '',
    phone: '',
    location: 'Mumbai, Maharashtra'
  });
  const [error, setError] = React.useState('');

  const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validBloodGroups.includes(formData.bloodGroup.toUpperCase())) {
      setError('Invalid Blood Group');
      return;
    }
    setError('');
    localStorage.setItem('user_name', formData.fullName);
    navigate('/eligibility');
  };

  return (
    <div className="split-layout animate-fade-in" style={{ padding: 'var(--spacing-6) 0' }}>
      {/* Left Side: Information and Map */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingRight: 'var(--spacing-8)' }} className="stagger-1">
        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <h2 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--spacing-4)', lineHeight: 1.1 }}>Register as Donor</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
            Join the hyper-local emergency network. We only alert you when someone in your immediate vicinity needs blood.
          </p>
        </div>
        
        {/* Map takes up remaining space on desktop */}
        <div style={{ flex: 1, minHeight: '300px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative', marginTop: 'var(--spacing-4)', border: '1px solid var(--color-border)' }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: 19.0760, lng: 72.8777 }}
              zoom={10}
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

      {/* Right Side: Form */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="stagger-2">
        <Card glass className="animate-slide-up">
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <Input 
                label="Full Name" 
                placeholder="John Doe" 
                icon={User} 
                required 
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              <Input 
                label="Blood Group" 
                placeholder="e.g. O+" 
                icon={Droplet} 
                required 
                value={formData.bloodGroup}
                onChange={(e) => {
                  setFormData({ ...formData, bloodGroup: e.target.value });
                  setError('');
                }}
              />
              {error && <p style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)', marginTop: '-8px' }}>{error}</p>}
              <Input 
                label="Phone Number" 
                type="tel" 
                placeholder="+1 234 567 890" 
                icon={Phone} 
                required 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input 
                label="Location" 
                placeholder="Mumbai" 
                icon={MapPin} 
                required 
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                readOnly // Since it's Mumbai only
              />
            </div>
            <Button type="submit" variant="primary" style={{ height: '60px', fontSize: 'var(--text-lg)' }}>Continue to Eligibility</Button>
            <Button variant="ghost" type="button" onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
