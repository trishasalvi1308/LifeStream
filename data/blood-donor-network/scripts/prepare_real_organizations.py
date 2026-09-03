from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
RAW_PATH = ROOT / "data" / "raw" / "mumbai_real_organizations.csv"
OUT_PATH = ROOT / "data" / "cleaned" / "organizations.csv"


def main():
    df = pd.read_csv(RAW_PATH)

    # Keep only the columns we need in the final output.
    final_columns = [
        "organization_id",
        "organization_name",
        "organization_type",
        "address",
        "area",
        "phone",
        "source_url",
        "latitude",
        "longitude",
        "is_verified",
        "is_active",
        "data_source",
    ]

    # Make sure the expected columns exist.
    for col in ["organization_id", "organization_name", "organization_type", "address", "area", "phone", "source_url"]:
        if col not in df.columns:
            df[col] = ""

    if "latitude" not in df.columns:
        df["latitude"] = None
    if "longitude" not in df.columns:
        df["longitude"] = None

    # Clean basic values.
    df = df.copy()
    df["organization_id"] = df["organization_id"].astype(str).str.strip()
    df["organization_name"] = df["organization_name"].astype(str).str.strip()
    df["organization_type"] = df["organization_type"].astype(str).str.strip().str.lower()
    df["address"] = df["address"].astype(str).str.strip()
    df["area"] = df["area"].astype(str).str.strip()
    df["phone"] = df["phone"].astype(str).str.strip()
    df["source_url"] = df["source_url"].astype(str).str.strip()

    # Keep the required types only.
    valid_types = {"hospital", "blood_bank"}
    df = df[df["organization_type"].isin(valid_types)].copy()

    # Add standard flags.
    df["is_verified"] = True
    df["is_active"] = True
    df["data_source"] = "public_organization_source"

    # Keep latitude and longitude empty for now.
    df["latitude"] = pd.Series([None] * len(df), index=df.index)
    df["longitude"] = pd.Series([None] * len(df), index=df.index)

    # Validation.
    print("Validation report:")
    print("- total organizations:", len(df))
    print("- duplicate organization IDs:", df["organization_id"].duplicated().sum())
    print("- duplicate organization names:", df["organization_name"].duplicated().sum())
    print("- invalid organization types:", (~df["organization_type"].isin(valid_types)).sum())

    # Save the cleaned file.
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    df[final_columns].to_csv(OUT_PATH, index=False)

    print(f"Saved cleaned organizations to: {OUT_PATH}")


if __name__ == "__main__":
    main()
