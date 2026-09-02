import React from 'react';
import { Card } from './Card';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface RequestItemProps {
  id: string;
  hospitalName: string;
  bloodGroup: string;
  units: number;
  priority: 'Critical' | 'Urgent' | 'Routine';
  distance?: string;
  status: 'Searching' | 'Matched' | 'Fulfilled';
  onActionClick?: () => void;
  actionText?: string;
}

export const RequestItem: React.FC<RequestItemProps> = ({ 
  id, hospitalName, bloodGroup, units, priority, distance, status, onActionClick, actionText 
}) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'Critical': return 'var(--color-primary)';
      case 'Urgent': return 'var(--color-warning)';
      default: return 'var(--color-success)';
    }
  };

  const getPriorityBg = () => {
    switch (priority) {
      case 'Critical': return 'linear-gradient(135deg, rgba(183,28,28,0.1) 0%, transparent 100%)';
      case 'Urgent': return 'linear-gradient(135deg, rgba(245,159,0,0.1) 0%, transparent 100%)';
      default: return 'linear-gradient(135deg, rgba(55,178,77,0.1) 0%, transparent 100%)';
    }
  };

  return (
    <Card className="hover-lift glass" style={{ 
      padding: 'var(--spacing-4)', 
      background: getPriorityBg(),
      borderLeft: `4px solid ${getPriorityColor()}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              color: getPriorityColor(),
              letterSpacing: '0.05em',
              background: 'rgba(255,255,255,0.6)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {priority} PRIORITY
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 600 }}>#{id}</span>
          </div>
          <h4 style={{ margin: '4px 0', fontSize: 'var(--text-lg)', color: 'var(--text-primary)', fontWeight: 700 }}>{hospitalName}</h4>
          {distance && (
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} /> {distance}
            </p>
          )}
        </div>
        
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          background: `linear-gradient(135deg, ${getPriorityColor()} 0%, rgba(255,255,255,0.2) 100%)`, 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 'var(--text-xl)',
          boxShadow: `0 4px 12px -2px ${getPriorityColor()}66`
        }}>
          {bloodGroup}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)', fontSize: 'var(--text-sm)', background: 'rgba(255,255,255,0.4)', padding: '12px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>Status</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: status === 'Matched' ? 'var(--color-success)' : 'var(--color-warning)', boxShadow: `0 0 0 3px ${status === 'Matched' ? 'var(--color-success)33' : 'var(--color-warning)33'}` }} />
            {status}
          </span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>Units Required</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{units} Units</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
        {actionText && (
          <Button 
            onClick={onActionClick} 
            style={{ 
              flex: 1, 
              padding: '10px', 
              fontSize: 'var(--text-sm)',
              backgroundColor: getPriorityColor(),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s'
            }}
            className="hover-lift"
          >
            {actionText} <ArrowRight size={16} />
          </Button>
        )}
        <Button 
          variant="secondary" 
          style={{ 
            flex: 1, 
            padding: '10px', 
            fontSize: 'var(--text-sm)',
            borderColor: 'var(--color-border)',
            color: 'var(--text-primary)',
            background: 'rgba(255,255,255,0.8)'
          }}
          className="hover-lift"
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};
