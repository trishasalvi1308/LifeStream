# Blood Donor Network

This project contains a small blood donor dataset and a cleaning script that prepares the raw data for downstream use.

## Folder structure

- `data/raw/` — original dataset
- `data/cleaned/` — cleaned donor export used as seed data
- `scripts/clean_donors.py` — script to normalize and clean donor records

## Run the cleaner

```bash
python scripts/clean_donors.py
```

## Output

The script reads the raw CSV from `data/raw/blood_donor_dataset.csv` and writes cleaned donor records to `data/cleaned/donors_seed.csv`.
