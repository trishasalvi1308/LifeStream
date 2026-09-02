import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { HeartPulse, Mail, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login for MVP, go directly to SOS or Registration depending on flow
    // For this flow, let's assume they want to register as a donor first
    navigate('/register');
  };

  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }} className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
        <HeartPulse size={48} color="var(--color-primary)" style={{ margin: '0 auto', marginBottom: 'var(--spacing-4)' }} className="animate-slide-up" />
        <h1 style={{ marginBottom: 'var(--spacing-2)' }} className="animate-slide-up stagger-1">LifeStream</h1>
        <p style={{ color: 'var(--text-secondary)' }} className="animate-slide-up stagger-2">Hyper-Local Emergency Blood Network</p>
      </div>

      <Card glass className="animate-slide-up stagger-3">
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input 
              type="email" 
              placeholder="Email Address" 
              icon={Mail} 
              required
            />
            <Input 
              type="password" 
              placeholder="Password" 
              icon={Lock}
              required
            />
          </div>
          <Button type="submit">Log In</Button>
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-4)' }}>
            <Button variant="ghost" type="button" onClick={() => navigate('/register')}>
              Don't have an account? Register
            </Button>
          </div>
        </form>
      </Card>
      
      <div style={{ marginTop: 'var(--spacing-8)', textAlign: 'center' }} className="animate-slide-up stagger-4">
        <Button variant="secondary" onClick={() => navigate('/sos')} style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
          I Need Blood Urgently (SOS)
        </Button>
      </div>
    </div>
  );
};
