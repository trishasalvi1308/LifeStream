from pathlib import Path
import random

import pandas as pd

RANDOM_SEED = 42
random.seed(RANDOM_SEED)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "data" / "cleaned"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

DONORS_PATH = OUTPUT_DIR / "donors_mumbai.csv"

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

FIRST_NAMES = [
    "Aarav", "Aditi", "Ananya", "Arjun", "Bhavna", "Chetan", "Diya", "Esha",
    "Farah", "Gaurav", "Hina", "Ishaan", "Jiya", "Karan", "Lavanya", "Manav",
    "Nisha", "Om", "Pooja", "Rohan", "Sana", "Tanvi", "Uday", "Veda", "Yash"
]

LAST_NAMES = [
    "Shah", "Patel", "Nair", "Rao", "Mehta", "Joshi", "Iyer", "Singh",
    "Verma", "Kulkarni", "Desai", "Kapoor", "Malhotra", "Reddy", "Chopra", "Sood"
]

GENDERS = ["Male", "Female", "Other"]


def synthetic_name():
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"


records = []
used_ids = set()
used_names = set()
used_phones = set()
used_coords = set()

# Keep a simple balanced split across the 8 blood groups.
for i in range(100):
    while True:
        area = random.choice(AREAS)
        center_lat, center_lon = AREA_CENTERS[area]
        lat = round(center_lat + random.uniform(-0.025, 0.025), 6)
        lon = round(center_lon + random.uniform(-0.025, 0.025), 6)
        lat = min(19.30, max(18.90, lat))
        lon = min(73.10, max(72.75, lon))
        coord = (lat, lon)
        if coord not in used_coords:
            used_coords.add(coord)
            break

    donor_id = f"DNR-{i + 1:03d}"
    name = synthetic_name()
    while name in used_names:
        name = synthetic_name()
    used_names.add(name)

    phone = str(random.randint(7000000000, 9999999999))
    while phone in used_phones:
        phone = str(random.randint(7000000000, 9999999999))
    used_phones.add(phone)

    days_since_donation = random.randint(20, 365)
    last_donation_date = pd.Timestamp.today() - pd.Timedelta(days=days_since_donation)
    eligibility_status = "eligible" if days_since_donation >= 56 else "not_eligible"

    blood_group = BLOOD_GROUPS[i % len(BLOOD_GROUPS)]

    donor = {
        "donor_id": donor_id,
        "name": name,
        "blood_group": blood_group,
        "age": random.randint(18, 60),
        "last_donation_date": last_donation_date,
        "phone": phone,
        "gender": random.choice(GENDERS),
        "is_available": random.choice([True, False]),
        "latitude": lat,
        "longitude": lon,
        "eligibility_status": eligibility_status,
        "data_source": "synthetic_demo",
    }
    records.append(donor)


# Keep the dataset deterministic and ensure there are no duplicates.
donors = pd.DataFrame(records)
assert len(donors) == 100
assert donors["donor_id"].is_unique
assert donors["name"].is_unique
assert donors["phone"].is_unique
assert not donors[["latitude", "longitude"]].duplicated().any()
assert set(BLOOD_GROUPS).issubset(set(donors["blood_group"]))

# Save to CSV.
donors.to_csv(DONORS_PATH, index=False)

# Validation prints.
print("total donors:", len(donors))
print("duplicate donor IDs:", donors["donor_id"].duplicated().sum())
print("duplicate names:", donors["name"].duplicated().sum())
print("duplicate phone numbers:", donors["phone"].duplicated().sum())
print("duplicate coordinates:", donors[["latitude", "longitude"]].duplicated().sum())
print("number of eligible donors:", (donors["eligibility_status"] == "eligible").sum())
print("number of not-eligible donors:", (donors["eligibility_status"] == "not_eligible").sum())
print("number of available donors:", donors["is_available"].sum())
print("number outside Mumbai bounds:", ((donors["latitude"] < 18.90) | (donors["latitude"] > 19.30) | (donors["longitude"] < 72.75) | (donors["longitude"] > 73.10)).sum())
print("blood group counts:")
print(donors["blood_group"].value_counts().sort_index())
