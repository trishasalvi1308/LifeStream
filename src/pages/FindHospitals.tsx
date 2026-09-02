import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Navigation, ArrowLeft } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { minimalMapOptions } from '../utils/mapStyles';

const libraries: ("places")[] = ["places"];

export const FindHospitals: React.FC = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [hospitals, setHospitals] = useState<google.maps.places.PlaceResult[]>([]);
  const [loadingMsg, setLoadingMsg] = useState('Finding your location...');
  
  const mapRef = useRef<google.maps.Map | null>(null);

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
          setLoadingMsg('Searching for nearby hospitals...');
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

  // Fetch nearby hospitals once map is loaded and we have location
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (userLocation) {
      searchHospitals(map, userLocation);
    }
  }, [userLocation]);

  const searchHospitals = (map: google.maps.Map, location: {lat: number, lng: number}) => {
    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: location,
      radius: 5000, // 5km
      type: 'hospital'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        // Sort by distance (roughly, based on proximity since Places API returns them somewhat ordered)
        setHospitals(results.slice(0, 5)); // Limit to top 5
      } else {
        setLoadingMsg('No hospitals found nearby.');
      }
    });
  };

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
              onLoad={onMapLoad}
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

              {/* Hospitals */}
              {hospitals.map((hospital, index) => (
                hospital.geometry?.location && (
                  <Marker 
                    key={index} 
                    position={hospital.geometry.location} 
                    icon={{
                      url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    }}
                  />
                )
              ))}
            </GoogleMap>
          </div>

          {/* List Side */}
          <div className="stagger-3" style={{ flex: 1, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', paddingRight: 'var(--spacing-2)' }}>
            {hospitals.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>{loadingMsg}</p>
            ) : (
              hospitals.map((hospital, index) => (
                <Card key={index} className="hover-lift" style={{ padding: 'var(--spacing-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--color-primary)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{hospital.name}</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} />
                      {hospital.vicinity || hospital.formatted_address || 'Address not available'}
                    </p>
                    {hospital.rating && (
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning)', marginTop: '4px', fontWeight: 600 }}>
                        ★ {hospital.rating} Rating
                      </p>
                    )}
                  </div>
                  <Button 
                    variant="primary"
                    style={{ padding: '8px', borderRadius: '50%' }}
                    onClick={() => {
                      if (hospital.name) {
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name)}`, '_blank');
                      }
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
