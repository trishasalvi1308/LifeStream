import React from 'react';
import { Card } from './Card';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, trendUp }) => {
  return (
    <Card glass style={{ padding: 'var(--spacing-4)', gap: 'var(--spacing-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 500 }}>{title}</h3>
        <div style={{ 
          backgroundColor: 'var(--color-primary-light)', 
          padding: '6px', 
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={18} color="var(--color-primary)" />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
        {trend && (
          <span style={{ 
            fontSize: 'var(--text-xs)', 
            color: trendUp ? 'var(--color-success)' : 'var(--color-warning)',
            marginTop: '4px'
          }}>
            {trend}
          </span>
        )}
      </div>
    </Card>
  );
};
