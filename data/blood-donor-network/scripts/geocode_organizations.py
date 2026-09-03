import time
import re
from pathlib import Path

import pandas as pd
from geopy.exc import GeocoderServiceError, GeocoderTimedOut, GeocoderUnavailable
from geopy.geocoders import Nominatim

ROOT = Path(__file__).resolve().parents[1]
INPUT_PATH = ROOT / "data" / "cleaned" / "organizations.csv"

GEOCODER = Nominatim(user_agent="nexora-blood-donor-hackathon")

MANUAL_COORDINATES = {
    "g.t. hospital": (18.9377, 72.8359),
    "breach candy hospital trust": (18.9725663, 72.8042677),
    "p. d. hinduja national hospital & medical research centre": (19.0332237, 72.8382311),
    "jaslok hospital & research centre": (18.973443, 72.8091464),
    "bombay hospital & medical research centre": (18.940767, 72.8282426),
}


def normalize_query(value):
    if value is None:
        return ""
    cleaned = str(value).strip()
    cleaned = cleaned.replace("LokmanyaTilak", "Lokmanya Tilak")
    cleaned = cleaned.replace("VitthaldasThackersey", "Vitthaldas Thackersey")
    cleaned = cleaned.replace("Dr. G. Deshmukh", "Dr G Deshmukh")
    cleaned = cleaned.replace("&", " and ")
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned


def build_name_aliases(name):
    if name is None:
        return []

    base = str(name).strip()
    aliases = []
    seen = set()

    for candidate in [
        base,
        base.replace("&", " and "),
        base.replace(".", ""),
        base.replace(".", "").replace(" and ", " "),
        base.replace(" & ", " "),
        base.replace("&", ""),
    ]:
        cleaned = normalize_query(candidate)
        if cleaned and cleaned not in seen:
            aliases.append(cleaned)
            seen.add(cleaned)

    if "Hospital" in base and "Mumbai" not in base:
        for candidate in [f"{base} Mumbai", f"{base} Mumbai India", f"{base} Fort Mumbai", f"{base} Mahim Mumbai"]:
            cleaned = normalize_query(candidate)
            if cleaned not in seen:
                aliases.append(cleaned)
                seen.add(cleaned)

    if "Breach Candy" in base:
        aliases.extend([
            "Breach Candy Hospital Mumbai",
            "Breach Candy Hospital Trust Mumbai",
        ])

    if "Hinduja" in base:
        aliases.extend([
            "Hinduja Hospital Mumbai",
            "Hinduja Hospital Mahim Mumbai",
            "P D Hinduja Hospital Mumbai",
        ])

    if "Jaslok" in base:
        aliases.extend([
            "Jaslok Hospital Mumbai",
            "Jaslok Hospital Research Centre Mumbai",
        ])

    if "Bombay" in base:
        aliases.extend([
            "Bombay Hospital Mumbai",
            "Bombay Hospital Medical Research Centre Mumbai",
            "Bombay Hospital New Marine Lines Mumbai",
        ])

    if "G.T." in base or "GT" in base.upper() or "G T" in base.upper():
        aliases.extend([
            "Grant Medical College Mumbai",
            "J J Hospital Mumbai",
            "G T Hospital Fort Mumbai",
            "Government Hospital Mumbai",
        ])

    normalized = []
    seen = set()
    for alias in aliases:
        alias = normalize_query(alias)
        if alias and alias not in seen:
            normalized.append(alias)
            seen.add(alias)
    return normalized


def geocode_address(address, name=None, area=None):
    if pd.isna(address) or str(address).strip() == "":
        return None, None, "empty"

    queries = []
    base = normalize_query(address)
    if base:
        queries.append((base, "full address"))

    for alias in build_name_aliases(name):
        queries.append((alias, "name fallback"))

    if name and area:
        area_name = normalize_query(area)
        if area_name:
            queries.append((f"{name}, {area_name}, Mumbai, India", "name + area + Mumbai"))

    if name:
        queries.append((f"{name}, Mumbai, India", "name + Mumbai"))

    normalized_name = normalize_query(name).lower() if name else ""
    if normalized_name in MANUAL_COORDINATES:
        lat, lon = MANUAL_COORDINATES[normalized_name]
        return lat, lon, "manual fallback"

    for query, label in queries:
        query = normalize_query(query)
        try:
            location = GEOCODER.geocode(query, timeout=20)
            if location is not None:
                time.sleep(1)
                return location.latitude, location.longitude, label
        except (GeocoderTimedOut, GeocoderUnavailable, GeocoderServiceError):
            pass

        time.sleep(1)

    return None, None, "failed"


def main():
    df = pd.read_csv(INPUT_PATH)

    required = ["organization_name", "address", "latitude", "longitude"]
    for col in required:
        if col not in df.columns:
            raise ValueError(f"The input CSV must include the column: {col}")

    df["latitude"] = pd.to_numeric(df["latitude"].replace("", pd.NA), errors="coerce")
    df["longitude"] = pd.to_numeric(df["longitude"].replace("", pd.NA), errors="coerce")

    missing_mask = df["latitude"].isna() | df["longitude"].isna()
    rows_to_geocode = df.loc[missing_mask].copy()

    print(f"Rows needing geocoding: {len(rows_to_geocode)}")

    success_count = 0
    fail_count = 0

    for idx, row in rows_to_geocode.iterrows():
        address = row["address"]
        name = row["organization_name"]
        area = row.get("area")

        lat, lon, used_query = geocode_address(address, name, area)

        if lat is not None and lon is not None:
            df.at[idx, "latitude"] = lat
            df.at[idx, "longitude"] = lon
            success_count += 1
            print(f"{name}: success via {used_query} -> ({lat}, {lon})")
        else:
            fail_count += 1
            print(f"Warning: could not geocode {name} -> {address}")

        time.sleep(1)

    df.to_csv(INPUT_PATH, index=False)

    print(f"Successfully geocoded: {success_count}")
    print(f"Failed geocoding: {fail_count}")


if __name__ == "__main__":
    main()
