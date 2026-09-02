import React from 'react';
import { Card } from './Card';
import type { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
  description?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({ title, icon: Icon, onClick }) => {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', flex: 1, display: 'flex' }}>
      <Card className="hover-lift" style={{ 
        padding: 'var(--spacing-4)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 'var(--spacing-3)',
        width: '100%',
        background: 'var(--bg-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 2px 8px -2px rgba(0,0,0,0.02)'
      }}>
        <div style={{ 
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={20} color="var(--color-primary)" strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>
          {title}
        </span>
      </Card>
    </div>
  );
};
