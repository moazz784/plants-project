# Frontend Integration Instructions

The LeafScan backend (ASP.NET Core API) is deployed separately. To connect your Vercel frontend to it, follow these steps.
Credentials 
admin : admin@LeafScans.com
pass : 123456789
---

### `Services.jsx` – Full integration (Option B: load dropdowns from API)

**Prerequisite:** Add `services` to `api.js` (see section 2) if not already present.

#### 1. Add imports
```jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { api, getErrorMessage } from './api';
```

#### 2. Add state for dropdown options and loading
After the existing state (around line 24), add:
```jsx
const [soilOptions, setSoilOptions] = useState([]);
const [climateOptions, setClimateOptions] = useState([]);
const [cropOptions, setCropOptions] = useState([]);
const [recLoading, setRecLoading] = useState(false);
const [calcLoading, setCalcLoading] = useState(false);
```

#### 3. Load dropdown options on mount
```jsx
useEffect(() => {
  api.services.getSoilTypes().then(setSoilOptions).catch(() => setSoilOptions([]));
  api.services.getClimates().then(setClimateOptions).catch(() => setClimateOptions([]));
  api.services.getCrops().then(setCropOptions).catch(() => setCropOptions([]));
}, []);
```

#### 4. Replace `handleGetRecommendation` (lines 28–40)
Make it async, call API, handle loading and errors:
```jsx
const handleGetRecommendation = async () => {
  if (!recommendationData.soilType || !recommendationData.climate) {
    alert(t("alert_missing_rec"));
    return;
  }
  setRecLoading(true);
  setRecResult(null);
  try {
    const data = await api.services.getRecommendations(recommendationData.soilType, recommendationData.climate);
    const cropDisplay = data.crops?.length > 0 ? data.crops.join(" & ") : t("no_crops_found") || "No crops found for this combination";
    setRecResult({
      bestCrop: cropDisplay,
      reason: t("res_reason", {
        soil: t(`opt_${recommendationData.soilType.toLowerCase()}`) || recommendationData.soilType,
        climate: t(`opt_${recommendationData.climate.toLowerCase()}`) || recommendationData.climate
      })
    });
  } catch (err) {
    toast.error(getErrorMessage(err));
  } finally {
    setRecLoading(false);
  }
};
```

#### 5. Replace `handleGetCalculation` (lines 43–53)
Make it async, call API, use real water/fertilizer values:
```jsx
const handleGetCalculation = async () => {
  const { soilType, climate, crop, landArea } = calculatorData;
  if (!soilType || !climate || !crop || !landArea) {
    alert(t("alert_missing_calc"));
    return;
  }
  setCalcLoading(true);
  setCalcResult(null);
  try {
    const data = await api.services.calculate(soilType, climate, crop, parseFloat(landArea));
    setCalcResult({
      water: data.waterLitersPerWeek.toLocaleString() + " " + t("liters_week"),
      fertilizer: data.fertilizerKg.toLocaleString() + " " + t("kg_unit")
    });
  } catch (err) {
    toast.error(getErrorMessage(err));
  } finally {
    setCalcLoading(false);
  }
};
```

#### 6. Pass API-loaded options to InputField components
Replace hardcoded `options` with state:
- **Select Best Crops** (lines 76–90): `options={soilOptions}` and `options={climateOptions}`
- **Irrigation Calculator** (lines 120–140): `options={soilOptions}`, `options={climateOptions}`, `options={cropOptions}`

#### 7. Disable buttons during loading
Add `disabled={recLoading}` to the "Get Recommendation" button and `disabled={calcLoading}` to the "Get Best Result" button. Optionally show loading text: `{recLoading ? t("loading") || "Loading..." : t("btn_get_rec")}`.

#### 8. Update InputField for i18n fallback
In the `InputField` component (line 197), change the option label from:
`{t(\`opt_${opt.toLowerCase()}\`)}`
to:
`{t(\`opt_${opt.toLowerCase()}\`) || opt}`
so options from the API without i18n keys display the raw name.

---

**Optional i18n keys** (if missing, the code uses fallbacks): `no_crops_found`, `loading`

---

## 6. API Response Shapes

- **Login/Register:** `{ token: string, user: { id, name, email, role, profileImageBase64 } }`
- **auth/me:** `{ id, name, email, role, profileImageBase64 }`
- **messages create:** `{ id, ... }` or similar
- **admin/messages:** `[{ id, senderFirstName, senderLastName, senderEmail, senderPhone, body, status, createdAtUtc }]`
- **services/recommendations (200):** `{ crops: string[], soilType: string, climate: string }` — e.g. `{ crops: ["Watermelon","Peanuts","Sorghum"], soilType: "Sandy", climate: "Arid" }`
- **services/calculate (200):** `{ waterLitersPerWeek: number, fertilizerKg: number }` — e.g. `{ waterLitersPerWeek: 6600, fertilizerKg: 216 }` for Tomato, 12 acres
- **services/calculate (404):** `{ code: "CROP_NOT_FOUND", message: "Crop not found or has no irrigation data" }`
- **services/soil-types, climates, crops:** `string[]` — e.g. `["Sandy","Clay","Silt","Loam"]`, `["Arid","Humid","Cold","Temperate","Tropical"]`, all 16 crops
- **Error responses:** `{ code: string, message: string, details?: any }`

---

## 7. Admin Account

Admin users must exist in the database (Users table with Role='Admin'). Create them via your database or a separate admin tool.
