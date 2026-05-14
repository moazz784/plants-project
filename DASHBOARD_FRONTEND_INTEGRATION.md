# Dashboard Frontend Integration Guide

## Endpoint

```
GET /api/admin/stats
Authorization: Admin role required (JWT cookie)
```

---

## Response Shape

```json
{
  "totalImages": 1567,
  "imagesAddedToday": 12,
  "totalDiagnoses": 843,
  "diagnosesToday": 5,
  "totalUsers": 320,
  "newUsersToday": 3,
  "totalMessages": 47,
  "newMessagesToday": 2,
  "diseaseRatePercent": 53.8,
  "healthyRatePercent": 46.2,
  "last7DaysImages": [
    { "day": "Mon", "count": 35 },
    { "day": "Tue", "count": 28 },
    { "day": "Wed", "count": 48 },
    { "day": "Thu", "count": 41 },
    { "day": "Fri", "count": 22 },
    { "day": "Sat", "count": 15 },
    { "day": "Sun", "count": 12 }
  ],
  "topDiseases": [
    { "diseaseName": "Tomato___Late_blight", "count": 210, "percent": 54.1 },
    { "diseaseName": "Potato___Early_blight", "count": 98,  "percent": 25.3 },
    { "diseaseName": "Apple___Apple_scab",    "count": 55,  "percent": 14.2 },
    { "diseaseName": "Corn___Common_rust",    "count": 20,  "percent": 5.2  },
    { "diseaseName": "Grape___Black_rot",     "count": 5,   "percent": 1.3  }
  ]
}
```

---

## How to Wire Up `Dashboard.jsx`

### Step 1 — Add `admin.getStats` to `src/api.js`

```js
// Inside the `admin` object in api.js
getStats: () => request('/admin/stats'),
```

Full addition to the `admin` section:
```js
const admin = {
  getMessages: () => request('/admin/messages'),
  patchMessage: (id, status) => request(`/admin/messages/${id}`, 'PATCH', { status }),
  deleteMessage: (id) => request(`/admin/messages/${id}`, 'DELETE'),
  getStats: () => request('/admin/stats'),   // ← ADD THIS
};
```

---

### Step 2 — Fetch stats in `Dashboard.jsx`

Replace the hardcoded data at the top of the component with a `useEffect` fetch:

```jsx
import { useState, useEffect } from 'react';
import api from './api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.getStats()
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load stats', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!stats)  return <div>Failed to load dashboard data.</div>;

  // ... rest of component using `stats`
}
```

---

### Step 3 — Replace hardcoded values with real data

#### Summary cards

| Hardcoded | Real value |
|---|---|
| `"15.670"` total images | `stats.totalImages.toLocaleString()` |
| `"+123 Today"` | `"+${stats.imagesAddedToday} Today"` |
| `"56% Total Disease"` | `"${stats.diseaseRatePercent}% Total Disease"` |
| `"85% Healthy"` | `"${stats.healthyRatePercent}% Healthy"` |
| `"25% Diseased"` | `"${stats.diseaseRatePercent}% Diseased"` |

#### Weekly bar chart

```jsx
// Replace hardcoded weeklyData array:
const weeklyData = stats.last7DaysImages.map(d => ({
  day: d.day,
  value: d.count,
}));
```

#### Top diseases (donut chart + sidebar list)

```jsx
// Replace hardcoded pieData array:
const pieData = stats.topDiseases.map((d, i) => ({
  name: d.diseaseName.replace(/___/g, ' — '),  // prettify snake_case
  value: d.count,
  percent: d.percent,
  color: DISEASE_COLORS[i] ?? '#94a3b8',       // keep your existing color array
}));
```

Define a color palette above the component:
```js
const DISEASE_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
```

#### Healthy vs Diseased progress bars

```jsx
<div style={{ width: `${stats.healthyRatePercent}%` }} className="bg-green-500 h-2 rounded" />
<span>{stats.healthyRatePercent}%</span>

<div style={{ width: `${stats.diseaseRatePercent}%` }} className="bg-red-500 h-2 rounded" />
<span>{stats.diseaseRatePercent}%</span>
```

---

## Notes

- The endpoint requires **Admin role**. The `AdminGuard` component already protects the `/dashboard` route — no extra auth logic needed.
- All counts use **UTC dates** on the backend. "Today" means UTC midnight → midnight.
- `last7DaysImages` always returns exactly 7 entries (oldest to newest). Days with zero uploads return `count: 0`.
- `topDiseases` returns up to 5 entries. If there are no diagnoses yet, the array is empty — handle this case in the chart renderer to avoid divide-by-zero.
- `diseaseRatePercent + healthyRatePercent` always equals `100.0`.
