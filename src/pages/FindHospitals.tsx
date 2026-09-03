import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Navigation, ArrowLeft } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { minimalMapOptions, libraries } from '../utils/mapStyles';
import { supabase } from '../config/supabase';

interface Organization {
  organization_id: string | number;
  organization_name: string;
  organization_type: 'hospital' | 'blood_bank';
  address: string | null;
  area: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceKm: number;
}

interface OrganizationRow extends Omit<Organization, 'distanceKm'> {}

const calculateDistanceKm = (
  first: { lat: number; lng: number },
  second: { lat: number; lng: number }
) => {
  const earthRadiusKm = 6371;
  const latitudeDifference = (second.lat - first.lat) * Math.PI / 180;
  const longitudeDifference = (second.lng - first.lng) * Math.PI / 180;
  const firstLatitude = first.lat * Math.PI / 180;
  const secondLatitude = second.lat * Math.PI / 180;
  const haversine = Math.sin(latitudeDifference / 2) ** 2
    + Math.cos(firstLatitude) * Math.cos(secondLatitude)
    * Math.sin(longitudeDifference / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

export const FindHospitals: React.FC = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingMsg, setLoadingMsg] = useState('Finding your location...');
  const [organizationsLoading, setOrganizationsLoading] = useState(false);
  const [organizationsError, setOrganizationsError] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoadingMsg('Loading nearby organizations...');
        },
        (error) => {
          console.error("Error fetching location", error);
          setLoadingMsg('Could not get your location. Please enable location services.');
        }
      );
    } else {
      setLoadingMsg('Geolocation is not supported by your browser.');
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    let isMounted = true;
    const loadOrganizations = async () => {
      setOrganizationsLoading(true);
      setOrganizationsError(null);

      const { data, error } = await supabase
        .from('organizations')
        .select('organization_id, organization_name, organization_type, address, area, phone, latitude, longitude')
        .eq('is_active', true)
        .eq('is_verified', true)
        .in('organization_type', ['hospital', 'blood_bank']);

      if (!isMounted) return;

      if (error) {
        setOrganizationsError('Could not load nearby organizations.');
        setOrganizationsLoading(false);
        return;
      }

      const sortedOrganizations = ((data ?? []) as OrganizationRow[])
        .filter((organization) => organization.latitude !== null && organization.longitude !== null)
        .map((organization) => ({
          ...organization,
          distanceKm: calculateDistanceKm(userLocation, {
            lat: organization.latitude as number,
            lng: organization.longitude as number
          })
        }))
        .sort((first, second) => first.distanceKm - second.distanceKm);

      setOrganizations(sortedOrganizations);
      setOrganizationsLoading(false);
    };

    void loadOrganizations();
    return () => {
      isMounted = false;
    };
  }, [userLocation]);

  return (
    <div className="animate-fade-in" style={{ padding: 'var(--spacing-6) 0', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      
      {/* Header */}
      <div className="stagger-1" style={{ marginBottom: 'var(--spacing-4)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: '50%', border: '1px solid var(--color-border)', cursor: 'pointer' }}>
          <ArrowLeft size={20} color="var(--text-primary)" />
        </button>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: '4px', color: 'var(--text-primary)', fontWeight: 700 }}>Nearby Hospitals</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Find the closest donation centers to your current location.</p>
        </div>
      </div>

      {!isLoaded || !userLocation ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          {loadError ? 'Error loading maps.' : loadingMsg}
        </div>
      ) : (
        <div className="split-layout" style={{ flex: 1, minHeight: 0, gap: 'var(--spacing-6)' }}>
          
          {/* Map Side */}
          <div className="stagger-2" style={{ flex: 1, height: '100%', minHeight: '300px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '4px solid white', boxShadow: '0 12px 24px -8px rgba(0,0,0,0.1)' }}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={userLocation}
              zoom={13}
              options={minimalMapOptions}
            >
              {/* User Location */}
              <Marker 
                position={userLocation} 
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: '#0050A4', /* Tertiary color for user */
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: '#ffffff',
                }}
              />

              {/* Supabase organizations */}
              {organizations.map((organization) => (
                <Marker
                    key={organization.organization_id}
                    position={{ lat: organization.latitude as number, lng: organization.longitude as number }}
                    icon={{
                      url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    }}
                  />
              ))}
            </GoogleMap>
          </div>

          {/* List Side */}
          <div className="stagger-3" style={{ flex: 1, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', paddingRight: 'var(--spacing-2)' }}>
            {organizationsLoading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading nearby organizations...</p>
            ) : organizationsError ? (
              <p style={{ color: 'var(--text-secondary)' }}>{organizationsError}</p>
            ) : organizations.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No verified hospitals or blood banks found nearby.</p>
            ) : (
              organizations.map((organization) => (
                <Card key={organization.organization_id} className="hover-lift" style={{ padding: 'var(--spacing-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--color-primary)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{organization.organization_name}</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      {organization.organization_type === 'blood_bank' ? 'Blood Bank' : 'Hospital'} · {organization.distanceKm.toFixed(1)} km away
                    </p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} />
                      {organization.address || 'Address not available'}
                    </p>
                    {organization.area && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>{organization.area}</p>}
                    {organization.phone && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>{organization.phone}</p>}
                  </div>
                  <Button 
                    variant="primary"
                    style={{ padding: '8px', borderRadius: '50%' }}
                    onClick={() => {
                      window.open(`https://www.google.com/maps/search/?api=1&query=${organization.latitude},${organization.longitude}`, '_blank');
                    }}
                  >
                    <Navigation size={18} />
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
