from pathlib import Path
import random

import pandas as pd

RANDOM_SEED = 42
random.seed(RANDOM_SEED)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "data" / "cleaned"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ORG_PATH = OUTPUT_DIR / "organizations.csv"
INV_PATH = OUTPUT_DIR / "inventory.csv"

BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
AREAS = [
    "Bandra",
    "Andheri",
    "Dadar",
    "Sion",
    "Kurla",
    "Powai",
    "Goregaon",
    "Malad",
    "Borivali",
    "Chembur",
    "Vikhroli",
    "Mulund",
]

AREA_CENTERS = {
    "Bandra": (19.0596, 72.8295),
    "Andheri": (19.1136, 72.8697),
    "Dadar": (19.0183, 72.8441),
    "Sion": (19.0416, 72.8647),
    "Kurla": (19.0658, 72.8847),
    "Powai": (19.1197, 72.9054),
    "Goregaon": (19.1687, 72.8489),
    "Malad": (19.1875, 72.8488),
    "Borivali": (19.2297, 72.8570),
    "Chembur": (19.0523, 72.8997),
    "Vikhroli": (19.2165, 72.9478),
    "Mulund": (19.1610, 72.9365),
}

HOSPITAL_PREFIXES = [
    "Apex",
    "Care",
    "City",
    "Green",
    "Horizon",
    "Life",
    "Mercy",
    "Metro",
    "Ocean",
    "Rose",
    "Sunrise",
    "Unity",
]

BANK_PREFIXES = [
    "Alpha",
    "Beacon",
    "Crescent",
    "Delta",
    "Emerald",
    "Fortune",
    "Harbor",
    "Jade",
]


def random_choice(seq):
    return random.choice(seq)


# Generate exactly 20 unique organizations.
org_records = []
used_ids = set()
used_names = set()
used_coords = set()

hospital_count = 0
blood_bank_count = 0

while len(org_records) < 20:
    org_type = "hospital" if hospital_count < 12 else "blood_bank"
    area = random_choice(AREAS)
    center_lat, center_lon = AREA_CENTERS[area]
    lat = round(center_lat + random.uniform(-0.025, 0.025), 6)
    lon = round(center_lon + random.uniform(-0.025, 0.025), 6)
    lat = min(19.30, max(18.90, lat))
    lon = min(73.10, max(72.75, lon))
    coord = (lat, lon)

    if coord in used_coords:
        continue

    if org_type == "hospital":
        hospital_count += 1
        name = f"{random_choice(HOSPITAL_PREFIXES)} Hospital {hospital_count}"
    else:
        blood_bank_count += 1
        name = f"{random_choice(BANK_PREFIXES)} Blood Bank {blood_bank_count}"

    if name in used_names:
        continue

    organization_id = f"ORG-{len(org_records) + 1:03d}"
    if organization_id in used_ids:
        continue

    used_ids.add(organization_id)
    used_names.add(name)
    used_coords.add(coord)

    org_records.append(
        {
            "organization_id": organization_id,
            "organization_name": name,
            "organization_type": org_type,
            "address": f"{random.randint(1, 999)} {area} Road, Mumbai",
            "area": area,
            "latitude": lat,
            "longitude": lon,
            "phone": f"9{random.randint(100000000, 999999999)}",
            "is_verified": random.choice([True, False]),
            "is_active": True,
            "data_source": "synthetic_demo",
        }
    )

organizations = pd.DataFrame(org_records)

# Force exact counts required by the task.
organizations = organizations.iloc[:20].copy()

# Make sure values are valid.
assert len(organizations) == 20
assert (organizations["organization_type"] == "hospital").sum() == 12
assert (organizations["organization_type"] == "blood_bank").sum() == 8
assert len(organizations["organization_id"].unique()) == 20
assert len(organizations["organization_name"].unique()) == 20
assert len(set(zip(organizations["latitude"], organizations["longitude"]))) == 20

# Save organizations
organizations.to_csv(ORG_PATH, index=False)

# Generate inventory records.
inventory_rows = []
seen_inventory = set()
shared_timestamp = pd.Timestamp.now()
for _, row in organizations.iterrows():
    for blood_group in BLOOD_GROUPS:
        inv_id = f"INV-{row['organization_id']}-{blood_group}"
        units_available = random.randint(0, 15)
        record = (
            row["organization_id"],
            blood_group,
            "PRBC",
            units_available,
            shared_timestamp,
            "synthetic_demo",
        )

        if inv_id in seen_inventory:
            continue
        seen_inventory.add(inv_id)

        inventory_rows.append(
            {
                "inventory_id": inv_id,
                "organization_id": row["organization_id"],
                "blood_group": blood_group,
                "component": "PRBC",
                "units_available": units_available,
                "last_updated": shared_timestamp,
                "data_source": "synthetic_demo",
            }
        )

inventory = pd.DataFrame(inventory_rows)
assert len(inventory) == 160
assert len(inventory) == len(inventory.drop_duplicates())

inventory.to_csv(INV_PATH, index=False)

# Validation checks
org_total = len(organizations)
hospital_total = (organizations["organization_type"] == "hospital").sum()
blood_bank_total = (organizations["organization_type"] == "blood_bank").sum()
inventory_total = len(inventory)
duplicate_org_ids = organizations["organization_id"].duplicated().sum()
duplicate_org_names = organizations["organization_name"].duplicated().sum()
duplicate_coords = organizations[["latitude", "longitude"]].duplicated().sum()
duplicate_inventory = inventory.duplicated().sum()
outside_bounds = (
    (organizations["latitude"] < 18.90) | (organizations["latitude"] > 19.30)
    | (organizations["longitude"] < 72.75) | (organizations["longitude"] > 73.10)
).sum()

print("total organizations:", org_total)
print("number of hospitals:", hospital_total)
print("number of blood banks:", blood_bank_total)
print("total inventory records:", inventory_total)
print("duplicate organization IDs:", duplicate_org_ids)
print("duplicate organization names:", duplicate_org_names)
print("duplicate coordinates:", duplicate_coords)
print("duplicate inventory records:", duplicate_inventory)
print("number of organizations outside the Mumbai geographic boundaries:", outside_bounds)
