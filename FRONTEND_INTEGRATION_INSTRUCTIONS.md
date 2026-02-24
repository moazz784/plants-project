# Frontend Integration Instructions

The LeafScan backend (ASP.NET Core API) is deployed separately. To connect your Vercel frontend to it, follow these steps.
Credentials 
admin : admin@LeafScans.com
pass : 123456789
---

## NEW CHANGES REQUIRED (Option A – Database Localization)

> **The backend now returns localized names (English/Arabic). The frontend must be updated to work with this.**

| # | Change | Where |
|---|--------|-------|
| 1 | **Pass `lang`** to all services API calls (`?lang=ar` or `?lang=en` based on `i18n.language`) | `api.js` + every call in `Services.jsx` |
| 2 | **Display option values as-is** – do NOT use `t('opt_loam')` or similar. The API returns "Loam" or "طمي" directly | `InputField` component: `{opt}` instead of `{t(\`opt_${opt}\`) \|\| opt}` |
| 3 | **Update `api.services`** – add `lang` parameter to `getSoilTypes`, `getClimates`, `getCrops`, `getRecommendations`, `calculate` | `api.js` |
| 4 | **Load options with lang** – pass `i18n.language` when fetching soil/climate/crop options | `useEffect` in `Services.jsx` |
| 5 | **Pass lang to recommendations and calculate** – include `lang` in `getRecommendations` and `calculate` calls | `handleGetRecommendation`, `handleGetCalculation` |
| 6 | **Re-fetch options when language changes** – add `i18n.language` to `useEffect` dependency array | `Services.jsx` |

---

## Option A: Database Localization (Current Backend)

The backend returns **localized names** (English or Arabic) based on the request language. No `opt_` prefix or i18n keys are used for soil, climate, or crop options.

### 1. Language parameter (required)

All services API calls must pass the current UI language so the backend returns localized names.

**Option A – Query parameter:** Append `?lang=ar` or `?lang=en` to every services endpoint based on `i18n.language`.

**Option B – Header:** Set `Accept-Language: ar` or `Accept-Language: en` in the request headers.

### 2. api.js – Pass lang to services

Update `api.services` to accept and pass `lang` (e.g. from `i18n.language`):

```js
services: {
  getSoilTypes: (lang) => api.get(`/services/soil-types${lang ? `?lang=${lang}` : ''}`),
  getClimates: (lang) => api.get(`/services/climates${lang ? `?lang=${lang}` : ''}`),
  getCrops: (lang) => api.get(`/services/crops${lang ? `?lang=${lang}` : ''}`),
  getRecommendations: (soilType, climate, lang) =>
    api.get(`/services/recommendations?soilType=${encodeURIComponent(soilType)}&climate=${encodeURIComponent(climate)}${lang ? `&lang=${lang}` : ''}`),
  calculate: (soilType, climate, crop, landArea, lang) =>
    api.get(`/services/calculate?soilType=${encodeURIComponent(soilType)}&climate=${encodeURIComponent(climate)}&crop=${encodeURIComponent(crop)}&landArea=${encodeURIComponent(landArea)}${lang ? `&lang=${lang}` : ''}`),
},
```

### 3. Display names – no opt_ or t() (IMPORTANT)

The API returns localized display names (e.g. "Loam", "طمي", "Tomato", "طماطم"). **Display these values directly.** Do **not** use `t('opt_loam')` or similar for soil, climate, or crop options.

**Before (causes "opt_loam" to appear):**
```jsx
{t(`opt_${opt.toLowerCase()}`) || opt}
```

**After (correct – display API value as-is):**
```jsx
{options.map(opt => (
  <option key={opt} value={opt}>{opt}</option>
))}
```

### 4. Request values

For recommendations and calculate, send the **exact** value the user selected (the localized name from the API). The backend resolves it via translation tables.

---

### `Services.jsx` – Full integration (load dropdowns from API)
**Prerequisite:** Add `services` to `api.js` (see above) and pass `lang` to all calls.

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

#### 3. Load dropdown options on mount (pass current language)
```jsx
useEffect(() => {
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
  api.services.getSoilTypes(lang).then(setSoilOptions).catch(() => setSoilOptions([]));
  api.services.getClimates(lang).then(setClimateOptions).catch(() => setClimateOptions([]));
  api.services.getCrops(lang).then(setCropOptions).catch(() => setCropOptions([]));
}, [i18n.language]);
```

#### 4. Replace `handleGetRecommendation`
Make it async, call API with lang, handle loading and errors. Display API values directly (no opt_):
```jsx
const handleGetRecommendation = async () => {
  if (!recommendationData.soilType || !recommendationData.climate) {
    toast.error(t("alert_missing_rec"));
    return;
  }
  setRecLoading(true);
  setRecResult(null);
  try {
    const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
    const data = await api.services.getRecommendations(recommendationData.soilType, recommendationData.climate, lang);
    const separator = i18n.language === 'ar' ? " و " : " & ";
    const cropDisplay = data.crops?.length > 0 ? data.crops.join(separator) : (t("no_crops_found") || "No crops found");
    setRecResult({
      bestCrop: cropDisplay,
      reason: t("res_reason", {
        soil: recommendationData.soilType,
        climate: recommendationData.climate
      })
    });
  } catch (err) {
    toast.error(getErrorMessage(err));
  } finally {
    setRecLoading(false);
  }
};
```

#### 5. Replace `handleGetCalculation`
Make it async, call API with lang, use real water/fertilizer values:
```jsx
const handleGetCalculation = async () => {
  const { soilType, climate, crop, landArea } = calculatorData;
  if (!soilType || !climate || !crop || !landArea) {
    toast.error(t("alert_missing_calc"));
    return;
  }
  setCalcLoading(true);
  setCalcResult(null);
  try {
    const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
    const data = await api.services.calculate(soilType, climate, crop, parseFloat(landArea), lang);
    const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    setCalcResult({
      water: data.waterLitersPerWeek.toLocaleString(locale) + " " + t("liters_week"),
      fertilizer: data.fertilizerKg.toLocaleString(locale) + " " + t("kg_unit")
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

#### 8. InputField – display API values directly
With Option A, the API returns localized names. Display them as-is (no t() or opt_):
```jsx
{options.map(opt => (
  <option key={opt} value={opt}>{opt}</option>
))}
```

---

**Optional i18n keys** (if missing, the code uses fallbacks): `no_crops_found`, `loading`

---

## 6. API Response Shapes

- **Login/Register:** `{ token: string, user: { id, name, email, role, profileImageBase64 } }`
- **auth/me:** `{ id, name, email, role, profileImageBase64 }`
- **messages create:** `{ id, ... }` or similar
- **admin/messages:** `[{ id, senderFirstName, senderLastName, senderEmail, senderPhone, body, status, createdAtUtc }]`
- **services/recommendations (200):** `{ crops: string[], soilType: string, climate: string }` — crops are localized (e.g. `["Watermelon","Peanuts"]` or `["بطيخ","فول سوداني"]` when lang=ar)
- **services/calculate (200):** `{ waterLitersPerWeek: number, fertilizerKg: number }` — e.g. `{ waterLitersPerWeek: 6600, fertilizerKg: 216 }` for Tomato, 12 acres
- **services/calculate (404):** `{ code: "CROP_NOT_FOUND", message: "Crop not found or has no irrigation data" }`
- **services/soil-types, climates, crops:** `string[]` — localized names. With `?lang=en`: `["Sandy","Clay","Silt","Loam"]`. With `?lang=ar`: `["رملية","طينية","غرينية","طمي"]`
- **Error responses:** `{ code: string, message: string, details?: any }`

---

## 7. Admin Account

Admin users must exist in the database (Users table with Role='Admin'). Create them via your database or a separate admin tool.
