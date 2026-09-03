from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
RAW_PATH = ROOT / "data" / "raw" / "mumbai_real_organizations.csv"
OUT_PATH = ROOT / "data" / "cleaned" / "organizations.csv"

REQUIRED_COLUMNS = [
    "organization_id",
    "organization_name",
    "organization_type",
    "address",
    "area",
    "latitude",
    "longitude",
    "phone",
    "source_url",
]


def validate(df):
    print("Validation report:")
    print("- total organizations:", len(df))
    print("- duplicate organization IDs:", df["organization_id"].duplicated().sum())
    print("- duplicate organization names:", df["organization_name"].duplicated().sum())
    print("- invalid organization types:", (~df["organization_type"].isin(["hospital", "blood_bank"])).sum())
    print("- empty addresses:", df["address"].isna().sum() + (df["address"].astype(str).str.strip() == "").sum())
    print("- latitude outside Mumbai bounds:", ((df["latitude"] < 18.90) | (df["latitude"] > 19.30)).sum())
    print("- longitude outside Mumbai bounds:", ((df["longitude"] < 72.75) | (df["longitude"] > 73.10)).sum())
    print("- duplicate organizations:", df.duplicated(subset=["organization_id", "organization_name", "address"]).sum())


def main():
    if not RAW_PATH.exists():
        raise FileNotFoundError(f"Input file not found: {RAW_PATH}")

    df = pd.read_csv(RAW_PATH)

    for col in REQUIRED_COLUMNS:
        if col not in df.columns:
            df[col] = pd.NA

    df = df.copy()
    df.columns = df.columns.str.strip()

    # Keep only the required output columns, in the requested order.
    output_columns = [
        "organization_id",
        "organization_name",
        "organization_type",
        "address",
        "area",
        "latitude",
        "longitude",
        "phone",
        "is_verified",
        "is_active",
        "data_source",
        "source_url",
    ]

    # Clean string values.
    for col in ["organization_id", "organization_name", "organization_type", "address", "area", "phone", "source_url"]:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()

    # Keep only valid organization types.
    df["organization_type"] = df["organization_type"].str.lower()
    df = df[df["organization_type"].isin(["hospital", "blood_bank"])].copy()

    # Fill standard values.
    df["is_verified"] = True
    df["is_active"] = True
    df["data_source"] = "public_organization_source"

    # Warn if coordinates are missing rather than inventing them.
    missing_coords = df[(df["latitude"].isna()) | (df["longitude"].isna())]
    if not missing_coords.empty:
        print(f"Warning: {len(missing_coords)} organizations are missing latitude/longitude values and were kept as-is.")

    # Keep a clean output without extra columns.
    df = df[output_columns]

    # Final validation.
    validate(df)

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUT_PATH, index=False)

    print(f"Saved cleaned organizations to: {OUT_PATH}")


if __name__ == "__main__":
    main()
