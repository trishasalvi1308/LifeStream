import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { HeartPulse, Phone } from 'lucide-react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithPopup(auth, googleProvider);
      
      if (localStorage.getItem('user_profile_completed') === 'true') {
        navigate('/sos');
      } else {
        navigate('/register');
      }
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    let formattedPhone = phoneNumber.trim().replace(/[\s-]/g, '');
    
    // Automatically add India country code if missing
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('0')) {
        formattedPhone = formattedPhone.substring(1);
      }
      formattedPhone = '+91' + formattedPhone;
    }

    // Basic E.164 validation before sending to Firebase
    if (!/^\+[1-9]\d{1,14}$/.test(formattedPhone)) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later or use Google Sign-in.');
      } else {
        setError(err.message || 'Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult) return;
    try {
      setLoading(true);
      setError('');
      await confirmationResult.confirm(otp);
      
      if (localStorage.getItem('user_profile_completed') === 'true') {
        navigate('/sos');
      } else {
        navigate('/register');
      }
    } catch (err: any) {
      setError('Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-layout animate-fade-in">
      {/* Left Side: Branding / Hero */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 'var(--spacing-8)' }}>
        <HeartPulse size={72} color="var(--color-primary)" style={{ marginBottom: 'var(--spacing-6)' }} className="animate-slide-up" />
        <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--spacing-4)', lineHeight: 1.1 }} className="animate-slide-up stagger-1">LifeStream</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xl)', maxWidth: '500px', marginBottom: 'var(--spacing-8)' }} className="animate-slide-up stagger-2">
          Hyper-Local Emergency Blood Network. When every second counts, we connect you to life-saving donors nearby.
        </p>
        
        <div className="animate-slide-up stagger-3">
          <Button variant="secondary" onClick={() => navigate('/sos')} style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', display: 'inline-flex' }}>
            I Need Blood Urgently (SOS)
          </Button>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Card glass className="animate-slide-up stagger-4">
          {error && <p style={{ color: 'var(--color-primary)', textAlign: 'center', marginBottom: 'var(--spacing-4)' }}>{error}</p>}
          
          {!confirmationResult ? (
            <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <Input 
                  type="tel" 
                  placeholder="Phone Number (e.g. 9876543210)" 
                  icon={Phone} 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</Button>
              
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>or</div>
              
              <Button type="button" variant="secondary" onClick={handleGoogleLogin} disabled={loading}>
                Sign in with Google
              </Button>
              
              <div style={{ textAlign: 'center', marginTop: 'var(--spacing-4)' }}>
                <Button variant="ghost" type="button" onClick={() => navigate('/register')}>
                  Don't have an account? Register
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <Input 
                  type="text" 
                  placeholder="Enter 6-digit OTP" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</Button>
              <div style={{ textAlign: 'center', marginTop: 'var(--spacing-4)' }}>
                <Button variant="ghost" type="button" onClick={() => setConfirmationResult(null)}>
                  Back to Phone Input
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};
