# LeafScan SQL Scripts

Run these scripts directly on your **online database** (runasp.net, monsterasp.net, Azure SQL, etc.) to create schema and seed data.

## Location

**Main script:** `LeafScan_Schema_And_Seed.sql`

Path: `backend/LeafScan.Infrastructure/SqlScripts/LeafScan_Schema_And_Seed.sql`

## How to run

1. Open your host's SQL execution panel (e.g. runasp.net SQL Manager, SSMS, Azure Data Studio).
2. Copy the full contents of `LeafScan_Schema_And_Seed.sql`.
3. Paste and execute against your production database.

The script is idempotent: it uses `IF NOT EXISTS` so you can run it multiple times safely.

## What it creates

- **Schema:** Users, Messages, Diseases, Plants, AiChatbots, ChatSessions, PlantImages, SoilData, UserChats, Diagnoses, UserPlantImages, Reports
- **Crop services:** SoilTypes, Climates, Crops, CropSoilClimates, CropRequirements
- **Seed data (from FAO, USDA, state extension sources):**
  - **Soil types:** Sandy, Clay, Silt, Loam (4 types)
  - **Climates:** Arid, Humid, Cold, Temperate, Tropical (5 types)
  - **Crops:** 45+ (vegetables, grains, legumes, fruits)
  - **CropSoilClimates:** 120+ suitability mappings
  - **CropRequirements:** 35+ irrigation/fertilizer factors (L/acre/week, kg/acre)

## Admin user

The Admin user (`admin@leafscan.com` / `Admin@123`) is seeded on **first API run**, not by this script, because the password hash is generated with BCrypt.

## Alternative: EF migrations

For local development, you can use `dotnet ef database update` to create tables, then run **only the seed section** (from `-- SoilTypes seed` onward) of this script to populate data.
