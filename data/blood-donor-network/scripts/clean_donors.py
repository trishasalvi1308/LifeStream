from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
RAW_PATH = ROOT / "data" / "raw" / "blood_donor_dataset.csv"
CLEAN_PATH = ROOT / "data" / "cleaned" / "donors_cleaned.csv"


# 1) Load the CSV
raw_df = pd.read_csv(RAW_PATH)
print("Rows before cleaning:", len(raw_df))

# 2) Remove leading/trailing whitespace from column names
raw_df.columns = raw_df.columns.str.strip()

# 3) Rename columns
raw_df = raw_df.rename(columns={"full_name": "name", "available_for_donation": "is_available"})

# 4) Remove exact duplicates
raw_df = raw_df.drop_duplicates()

# 5) Strip whitespace from string values
string_columns = raw_df.select_dtypes(include=["object", "string"]).columns
for col in string_columns:
    raw_df[col] = raw_df[col].astype(str).str.strip()

# 6) Standardize blood_group to uppercase
raw_df["blood_group"] = raw_df["blood_group"].str.upper()

# 7) Convert is_available: Yes -> True, No -> False
raw_df["is_available"] = raw_df["is_available"].str.strip().str.title()
raw_df["is_available"] = raw_df["is_available"].map({"Yes": True, "No": False})

# 8) Convert last_donation_date to proper pandas date
raw_df["last_donation_date"] = pd.to_datetime(raw_df["last_donation_date"], errors="coerce")

# 9) Convert phone to string to preserve leading zeros
raw_df["phone"] = raw_df["phone"].astype("string").where(raw_df["phone"].notna(), pd.NA).astype(str)

# 10) Check missing values in important fields
important_fields = ["name", "blood_group", "age", "city", "is_available"]
print("Missing values in important fields:")
print(raw_df[important_fields].isnull().sum())

# 11) Only drop rows if required for essential data
# Keep this minimal and beginner-friendly.
raw_df = raw_df.dropna(subset=["name", "blood_group", "age", "city", "is_available"]).reset_index(drop=True)

# 12) Save cleaned result
CLEAN_PATH.parent.mkdir(parents=True, exist_ok=True)
raw_df.to_csv(CLEAN_PATH, index=False)

# 13) Print row count and final columns
print("Rows after cleaning:", len(raw_df))
print("Final columns:", list(raw_df.columns))
print("Saved cleaned data to:", CLEAN_PATH)
