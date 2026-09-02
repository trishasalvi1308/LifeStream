import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { AlertTriangle, MapPin, Droplet, Activity } from 'lucide-react';

export const SosRequest: React.FC = () => {
  const navigate = useNavigate();

  const [bloodGroup, setBloodGroup] = React.useState('');
  const [error, setError] = React.useState('');
  const [location, setLocation] = React.useState('Mumbai, Maharashtra');

  const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validBloodGroups.includes(bloodGroup.toUpperCase())) {
      setError('invalid entry');
      return;
    }
    setError('');
    navigate('/verify-hospital');
  };

  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', flex: 1 }} className="animate-fade-in">
      <div style={{ marginBottom: 'var(--spacing-6)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--color-primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulseRed 2s infinite'
        }}>
          <AlertTriangle color="var(--color-primary)" />
        </div>
        <div>
          <h2 style={{ color: 'var(--color-primary)' }}>Emergency SOS</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Broadcast to all nearby hospitals.</p>
        </div>
      </div>

      <Card glass className="animate-slide-up">
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
            {error && <p style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)', marginTop: '-8px' }}>{error}</p>}
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
            <div style={{ width: '100%', height: '150px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <iframe
                title="Mumbai Map"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1693555555555!5m2!1sen!2sin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          
          <Button type="submit" style={{ backgroundColor: 'var(--color-primary)', height: '56px', fontSize: 'var(--text-lg)' }}>
            Broadcast SOS
          </Button>
          <Button variant="ghost" type="button" onClick={() => navigate('/login')}>
            Cancel
          </Button>
        </form>
      </Card>
    </div>
  );
};
