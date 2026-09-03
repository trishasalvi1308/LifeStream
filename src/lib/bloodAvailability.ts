import { supabase } from '../config/supabase';

export interface BloodAvailabilityOrganization {
  organization_id: string | number;
  organization_name: string;
  organization_type: string;
  address: string | null;
  area: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  blood_group: string;
  available_quantity: number;
}

interface InventoryRow {
  organization_id: string | number;
  blood_group: string;
  units_available: number;
}

const localInventoryUrl = new URL(
  '../../data/blood-donor-network/data/cleaned/inventory.csv',
  import.meta.url
).href;

const parseCsvLine = (line: string) => {
  const fields: string[] = [];
  let field = '';
  let quoted = false;

  for (const character of line) {
    if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      fields.push(field);
      field = '';
    } else {
      field += character;
    }
  }
  fields.push(field);
  return fields;
};

const loadLocalInventory = async (bloodGroup: string): Promise<InventoryRow[]> => {
  const response = await fetch(localInventoryUrl);
  if (!response.ok) return [];

  const lines = (await response.text()).trim().split(/\r?\n/);
  const headers = parseCsvLine(lines.shift() ?? '');
  const organizationIndex = headers.indexOf('organization_id');
  const bloodGroupIndex = headers.indexOf('blood_group');
  const unitsIndex = headers.indexOf('units_available');

  return lines
    .map(parseCsvLine)
    .map((fields) => ({
      organization_id: fields[organizationIndex],
      blood_group: fields[bloodGroupIndex],
      units_available: Number(fields[unitsIndex])
    }))
    .filter((record) => record.blood_group === bloodGroup && record.units_available > 0);
};

interface OrganizationRow {
  organization_id: string | number;
  organization_name: string;
  organization_type: string;
  address: string | null;
  area: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
}

export async function getOrganizationsWithBloodAvailability(
  requestedBloodGroup: string
): Promise<{ data: BloodAvailabilityOrganization[]; error: Error | null }> {
  const bloodGroup = requestedBloodGroup.trim().toUpperCase();
  if (!bloodGroup) {
    return { data: [], error: new Error('A blood group is required.') };
  }

  const { data: inventory, error: inventoryError } = await supabase
    .from('inventory')
    .select('organization_id, blood_group, units_available')
    .eq('blood_group', bloodGroup)
    .gt('units_available', 0);

  if (inventoryError) {
    return { data: [], error: inventoryError };
  }

  let availableInventory = (inventory ?? []) as InventoryRow[];
  if (availableInventory.length === 0) {
    try {
      availableInventory = await loadLocalInventory(bloodGroup);
    } catch {
      availableInventory = [];
    }
  }
  if (availableInventory.length === 0) {
    return { data: [], error: null };
  }

  const organizationIds = [...new Set(
    availableInventory.map((record) => record.organization_id)
  )];
  const { data: organizations, error: organizationsError } = await supabase
    .from('organizations')
    .select('organization_id, organization_name, organization_type, address, area, phone, latitude, longitude')
    .eq('is_active', true)
    .eq('is_verified', true)
    .in('organization_id', organizationIds);

  if (organizationsError) {
    return { data: [], error: organizationsError };
  }

  const organizationsById = new Map(
    ((organizations ?? []) as OrganizationRow[]).map((organization) => [
      String(organization.organization_id),
      organization
    ])
  );

  const results = availableInventory
    .filter((record) => record.units_available > 0 && organizationsById.has(String(record.organization_id)))
    .map((record) => {
      const organization = organizationsById.get(String(record.organization_id)) as OrganizationRow;
      return {
        ...organization,
        blood_group: record.blood_group,
        available_quantity: record.units_available
      };
    });

  return { data: results, error: null };
}