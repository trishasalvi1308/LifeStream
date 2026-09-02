import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const Eligibility: React.FC = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({ q1: false, q2: false, q3: false });

  const isEligible = answers.q1 && answers.q2 && answers.q3;

  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', flex: 1 }} className="animate-fade-in">
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <h2 style={{ marginBottom: 'var(--spacing-2)' }}>Eligibility Check</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Quick health questionnaire.</p>
      </div>

      <Card glass className="animate-slide-up">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          
          <label style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'flex-start', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              style={{ marginTop: '5px' }}
              checked={answers.q1} 
              onChange={(e) => setAnswers(prev => ({...prev, q1: e.target.checked}))} 
            />
            <span>I am between 18 and 65 years old and weigh over 50kg.</span>
          </label>

          <label style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'flex-start', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              style={{ marginTop: '5px' }}
              checked={answers.q2} 
              onChange={(e) => setAnswers(prev => ({...prev, q2: e.target.checked}))} 
            />
            <span>I have not donated blood in the last 3 months.</span>
          </label>

          <label style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'flex-start', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              style={{ marginTop: '5px' }}
              checked={answers.q3} 
              onChange={(e) => setAnswers(prev => ({...prev, q3: e.target.checked}))} 
            />
            <span>I have not had any tattoos or major surgeries in the last 6 months.</span>
          </label>

          {isEligible ? (
            <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'rgba(55, 178, 77, 0.1)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', color: 'var(--color-success)' }}>
              <CheckCircle2 />
              <span>You are eligible to donate!</span>
            </div>
          ) : (
            <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'rgba(245, 159, 0, 0.1)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', color: 'var(--color-warning)' }}>
              <AlertCircle />
              <span>Please confirm all statements to proceed.</span>
            </div>
          )}

          <Button 
            disabled={!isEligible} 
            onClick={() => {
              localStorage.setItem('user_profile_completed', 'true');
              navigate('/sos');
            }}
            style={{ marginTop: 'var(--spacing-4)' }}
          >
            Complete Registration
          </Button>
        </div>
      </Card>
    </div>
  );
};
