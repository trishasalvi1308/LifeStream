import React from 'react';
import { calculateDistanceKm } from '../lib/sosMatching';

export const EMERGENCY_GEOFENCE_RADIUS_KM = 15;

interface EmergencyGeofenceProps {
  sosLocation: { latitude: number; longitude: number };
  organization: {
    organization_name: string;
    latitude: number;
    longitude: number;
  };
}

export const EmergencyGeofence: React.FC<EmergencyGeofenceProps> = ({ sosLocation, organization }) => {
  const distanceKm = calculateDistanceKm(sosLocation, {
    latitude: organization.latitude,
    longitude: organization.longitude
  });
  const isInsideGeofence = distanceKm <= EMERGENCY_GEOFENCE_RADIUS_KM;

  console.log('[Phase 6] SOS coordinates', sosLocation);
  console.log('[Phase 6] matched organization coordinates', {
    latitude: organization.latitude,
    longitude: organization.longitude
  });
  console.log('[Phase 6] calculated distance', distanceKm);
  console.log('[Phase 6] geofence radius', EMERGENCY_GEOFENCE_RADIUS_KM);
  console.log('[Phase 6] inside/outside result', isInsideGeofence ? 'inside' : 'outside');

  return (
    <div style={{ marginBottom: 'var(--spacing-6)', padding: 'var(--spacing-4)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
      <h3 style={{ marginBottom: 'var(--spacing-3)' }}>Emergency Response Zone</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ width: '130px', height: '130px', borderRadius: '50%', border: '3px solid var(--color-primary)', background: 'var(--color-primary-light)', position: 'relative', flexShrink: 0 }}>
          <span style={{ position: 'absolute', top: '50%', left: '50%', width: '12px', height: '12px', transform: 'translate(-50%, -50%)', borderRadius: '50%', background: 'var(--color-primary)', border: '2px solid white' }} title="SOS location" />
          <span style={{ position: 'absolute', top: '18%', left: '68%', width: '12px', height: '12px', transform: 'translate(-50%, -50%)', borderRadius: '50%', background: 'var(--color-tertiary)', border: '2px solid white' }} title={organization.organization_name} />
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          <p>Radius: <strong>{EMERGENCY_GEOFENCE_RADIUS_KM} km</strong></p>
          <p>SOS: {sosLocation.latitude.toFixed(5)}, {sosLocation.longitude.toFixed(5)}</p>
          <p>{organization.organization_name}: {organization.latitude.toFixed(5)}, {organization.longitude.toFixed(5)}</p>
          <p style={{ color: isInsideGeofence ? 'var(--color-success)' : 'var(--color-primary)', fontWeight: 700, marginTop: 'var(--spacing-2)' }}>
            {isInsideGeofence ? 'Organization is inside the emergency response zone' : 'Organization is outside the emergency response zone'}
          </p>
        </div>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
        Distance between SOS location and organization: <strong>{distanceKm.toFixed(1)} km</strong>
      </p>
    </div>
  );
};