import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { User, MapPin, Phone, Droplet } from 'lucide-react';

export const DonorRegistration: React.FC = () => {
  const navigate = useNavigate();

  const [bloodGroup, setBloodGroup] = React.useState('');
  const [error, setError] = React.useState('');
  const [location, setLocation] = React.useState('Mumbai, Maharashtra');

  const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validBloodGroups.includes(bloodGroup.toUpperCase())) {
      setError('invalid entry');
      return;
    }
    setError('');
    navigate('/eligibility');
  };

  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', flex: 1 }} className="animate-fade-in">
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <h2 style={{ marginBottom: 'var(--spacing-2)' }}>Register as Donor</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Join the hyper-local emergency network.</p>
      </div>

      <Card glass className="animate-slide-up">
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input label="Full Name" placeholder="John Doe" icon={User} required />
            <Input 
              label="Blood Group" 
              placeholder="e.g. O+" 
              icon={Droplet} 
              required 
              value={bloodGroup}
              onChange={(e) => {
                setBloodGroup(e.target.value);
                setError('');
              }}
            />
            {error && <p style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)', marginTop: '-8px' }}>{error}</p>}
            <Input label="Phone Number" type="tel" placeholder="+1 234 567 890" icon={Phone} required />
            <Input 
              label="Location" 
              placeholder="Mumbai" 
              icon={MapPin} 
              required 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              readOnly // Since it's Mumbai only
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
          <Button type="submit">Continue to Eligibility</Button>
          <Button variant="ghost" type="button" onClick={() => navigate('/login')}>
            Back to Login
          </Button>
        </form>
      </Card>
    </div>
  );
};
