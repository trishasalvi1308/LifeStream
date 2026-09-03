import { getOrganizationsWithBloodAvailability } from './bloodAvailability';

export interface SosOrganizationMatch {
  organization_id: string | number;
  organization_name: string;
  organization_type: string;
  address: string | null;
  area: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
  blood_group: string;
  available_quantity: number;
  distance_km: number;
}

export const calculateDistanceKm = (
  first: { latitude: number; longitude: number },
  second: { latitude: number; longitude: number }
) => {
  const earthRadiusKm = 6371;
  const latitudeDifference = (second.latitude - first.latitude) * Math.PI / 180;
  const longitudeDifference = (second.longitude - first.longitude) * Math.PI / 180;
  const firstLatitude = first.latitude * Math.PI / 180;
  const secondLatitude = second.latitude * Math.PI / 180;
  const haversine = Math.sin(latitudeDifference / 2) ** 2
    + Math.cos(firstLatitude) * Math.cos(secondLatitude)
    * Math.sin(longitudeDifference / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

export async function findNearestSosOrganization(
  bloodGroup: string,
  location: { latitude: number; longitude: number }
): Promise<{ match: SosOrganizationMatch | null; error: Error | null }> {
  const { data: availableOrganizations, error } = await getOrganizationsWithBloodAvailability(bloodGroup);
  if (error) return { match: null, error };

  const matches = availableOrganizations
    .filter((organization) => organization.latitude !== null && organization.longitude !== null)
    .map((organization) => ({
      ...organization,
      latitude: organization.latitude as number,
      longitude: organization.longitude as number,
      distance_km: calculateDistanceKm(location, {
        latitude: organization.latitude as number,
        longitude: organization.longitude as number
      })
    }))
    .sort((first, second) => first.distance_km - second.distance_km);

  return { match: matches[0] ?? null, error: null };
}