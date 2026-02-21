# Frontend Integration Instructions

The LeafScan backend (ASP.NET Core API) is deployed separately. To connect your Vercel frontend to it, follow these steps.

---

## Important: Approach

**No frontend changes have been made.** This project uses a backend-only development approach:

- ✅ **Backend:** All API endpoints, auth, crop services, etc. are implemented and ready.
- ❌ **Frontend:** The frontend was **not modified**. It still uses `localStorage` for auth, hardcoded data for Services and Dashboard, and has no API client.

**The frontend developer must implement all changes described in this document** to connect the React/Vercel frontend to the backend. Follow the sections below in order.

---

## 0. Current State: Routes and Backend Connection

### Routes (`App.jsx`)

| Route | Component | Protected | Backend Connection |
|-------|------------|-----------|--------------------|
| `/` | Home | Yes (checks `hasloged`) | Not connected — uses localStorage |
| `/about` | About | No | Not connected — static |
| `/services` | Services | No | Backend ready — wire to `api.services.*` |
| `/contact-us` | Contact | No | Not connected — form has no `onSubmit`, no `name` attributes |
| `/plants` | Plantscategoriy | No | Not connected — uses static i18n |
| `/profile` | Profile | No (should require login when wired) | Not connected — uses `localStorage` |
| `/dashboard` | Dashboard | No (should require Admin when wired) | Not connected — all data hardcoded |
| `/login` | Loginpage | No | Not connected — uses `localStorage` |
| `/forgot-password` | — | — | No route — link in Loginpage leads to 404 (Momo) |
| `*` | Momo | No | 404 page — no backend |

### Component-by-Component Status

| Component | Current Data Source | Backend Ready | Action Needed |
|-----------|---------------------|---------------|---------------|
| **Loginpage.jsx** | `localStorage` (`hasloged`, `user_data`) | Yes | Wire to `api.auth.login` / `api.auth.register` |
| **Profile.jsx** | `localStorage` (`user_data`) | Yes | Wire to `api.auth.me`, `api.users.updateMe` |
| **Header.jsx** | `localStorage` (`user_data`) | Yes | Wire to `useAuth()`, `api.users.updateMe` for image |
| **Contact.jsx** | None (form not wired) | Yes | Add `onSubmit`, `name` attrs, call `api.messages.create` |
| **Dashboard.jsx** | Hardcoded arrays | Yes | Wire to `api.admin.getMessages`, `api.admin.getDashboardStats` |
| **Services.jsx** | Hardcoded options & logic | Yes | Wire to `api.services.getSoilTypes`, `api.services.getClimates`, `api.services.getCrops`, `api.services.getRecommendations`, `api.services.calculate` |
| **Home.jsx** | `localStorage` (`hasloged`) | Yes | Replace with `useAuth()` |

### Files That Do Not Exist Yet

- `src/api.js` — API client
- `src/AuthContext.jsx` — Auth state provider
- `src/AdminGuard.jsx` — Admin-only route guard

---

## 1. Environment Variable (Vercel)

Add this in your Vercel project **Settings → Environment Variables**:

| Name | Value |
|------|-------|
| `VITE_API_URL` | Your backend API base URL, e.g. `https://plantgraduationproject.runasp.net/api` |

---

## 2. API Client (`src/api.js`)

Create a file `src/api.js` that calls the backend:

```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5128/api';  // Backend runs on port 5128 locally

function getToken() {
  return localStorage.getItem('access_token');
}

function getAuthHeaders() {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

/** Extract user-facing message from API error response */
export function getErrorMessage(err, fallback = 'Something went wrong') {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  return err.message || err.code || fallback;
}

export const api = {
  async request(method, path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, ...data };
    return data;
  },
  get: (path) => api.request('GET', path),
  post: (path, body) => api.request('POST', path, body),
  put: (path, body) => api.request('PUT', path, body),
  patch: (path, body) => api.request('PATCH', path, body),

  auth: {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (name, email, password) => api.post('/auth/register', { name, email, password }),
    me: () => api.get('/auth/me'),
  },
  users: {
    updateMe: (body) => api.put('/users/me', {
      name: body.name,
      newPassword: body.newPassword,
      profileImageBase64: body.profileImageBase64,
    }),
  },
  messages: {
    create: (body) => api.post('/messages', body),
  },
  admin: {
    getMessages: () => api.get('/admin/messages'),
    patchMessage: (id, status) => api.patch(`/admin/messages/${id}`, { status }),  // status: "Read" | "Archived"
    getDashboardStats: () => api.get('/admin/dashboard-stats'),  // { totalImages, diseaseDistribution, dailyAnalysis, mostCommonDiseases }
  },
  services: {
    getSoilTypes: () => api.get('/services/soil-types'),
    getClimates: () => api.get('/services/climates'),
    getCrops: () => api.get('/services/crops'),
    getRecommendations: (soilType, climate) => api.get(`/services/recommendations?soilType=${encodeURIComponent(soilType)}&climate=${encodeURIComponent(climate)}`),
    calculate: (soilType, climate, crop, landArea) => api.get(`/services/calculate?soilType=${encodeURIComponent(soilType)}&climate=${encodeURIComponent(climate)}&crop=${encodeURIComponent(crop)}&landArea=${encodeURIComponent(landArea)}`),
  },
};
```

---

## 3. Auth Context (`src/AuthContext.jsx`)

Create `src/AuthContext.jsx` to hold auth state and token:

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (token, userData) => {
    localStorage.setItem('access_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const data = await api.auth.me();
      setUser(data);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.auth.me()
      .then(setUser)
      .catch(logout)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

## 4. Admin Guard (`src/AdminGuard.jsx`)

Create `src/AdminGuard.jsx` to protect Dashboard (Admin only):

```jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function AdminGuard() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'Admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
```

---

## 5. Required Code Changes

### `App.jsx`
- Wrap the entire app with `<AuthProvider>` (from AuthContext)
- Protect the Dashboard: use `AdminGuard` as the route element so only Admin users can access it

```jsx
// Add imports
import { AuthProvider } from './AuthContext';
import AdminGuard from './AdminGuard';

// Wrap app with AuthProvider. AdminGuard uses <Outlet />, so nest Dashboard inside it.
<AuthProvider>
  <Toaster position="top-center" richColors />
  <BrowserRouter>
    <Routes>
      <Route element={<Header />}>
        <Route path="/" element={<Home />} />
        {/* ... other routes ... */}
      </Route>
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<AdminGuard />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="/login" element={<Loginpage />} />
      <Route path="*" element={<Momo />} />
    </Routes>
  </BrowserRouter>
</AuthProvider>
```

### `Loginpage.jsx`
- Replace localStorage-based login with `api.auth.login(email, password)` and `api.auth.register(name, email, password)`
- Response shape: `{ token, user }` — call `login(token, user)` from `useAuth()` (stores token in localStorage)
- Remove `hasloged` and `user_data`; use auth context instead
- Use `getErrorMessage(err)` for error toasts
- **Forgot password:** Link points to `/forgot-password` but no route exists — leads to 404. Backend has no forgot-password endpoint. Either add a route + page (with backend support) or remove/hide the link for now.

### `Home.jsx`
- Replace `hasloged` check with `access_token` or `user` from `useAuth()`
- Redirect to `/login` if not authenticated

### `Contact.jsx`
- Add form state and `onSubmit` handler
- Call `api.messages.create({ senderFirstName, senderLastName, senderEmail, senderPhone, body })` — field names must match (camelCase)
- Require user to be logged in (check `access_token` or `useAuth()`); show toast if not
- Use `getErrorMessage(err)` from api.js for error toasts

### `Header.jsx`
- Use `useAuth()` for `user` and `logout`
- On logout, remove `access_token` and call `logout()` from context
- Show Admin Dashboard link only when `user?.role === 'Admin'`
- Profile image update: call `api.users.updateMe({ profileImageBase64 })`

### `Profile.jsx`
- Use `useAuth()` for user data and `refreshUser`
- Form submit: call `api.users.updateMe({ name, newPassword })`, then `refreshUser()`
- Use `authUser` for initial form values

### `Services.jsx`
- **Select Best Crops (recommendation card):**
  - Load soil types and climates from `api.services.getSoilTypes()` and `api.services.getClimates()` for dropdowns (or keep hardcoded `['Sandy','Clay','Silt']` and `['Arid','Humid','Cold']` — they match the backend).
  - On "Get Recommendation" click: call `api.services.getRecommendations(soilType, climate)`.
  - Response: `{ crops: string[], soilType: string, climate: string }` — display `crops.join(' & ')` as the recommended plants, and use `res_reason` i18n with soilType/climate for the subtitle.

- **Irrigation & Fertilization Calculator** (dedicated instructions):
  1. **Inputs:** Soil Type, Climate, Crop, Land Area (acres) — all required before "Get Best Result".
  2. **API call:** `api.services.calculate(soilType, climate, crop, landArea)` — pass the selected values; `landArea` must be a number.
  3. **Response:** `{ waterLitersPerWeek: number, fertilizerKg: number }`.
  4. **Display:**
     - Water: `waterLitersPerWeek.toLocaleString() + ' ' + t('liters_week')` (e.g. `"6,600 Liters/Week"`).
     - Fertilizer: `fertilizerKg.toLocaleString() + ' ' + t('kg_unit')` (e.g. `"216 Kg (NPK 20-20-20)"`).
  5. **Error handling:** Some crops (e.g. Apple, Peach, Grape) have no calculator data — API returns 404. Use `getErrorMessage(err)` for user-facing toasts; suggest choosing a crop from the recommendation list or the main calculator crops (Tomato, Wheat, Corn, Rice, etc.).
  6. **Dropdown sources:**
     - Soil Types: `api.services.getSoilTypes()` → `[{ id, name }]`
     - Climates: `api.services.getClimates()` → `[{ id, name }]`
     - Crops: `api.services.getCrops()` → `[{ id, name }]` — many crops have calculator data; a few return 404 on calculate.
  7. **Replace hardcoded logic:** Remove `(landArea * 500)` and `(landArea * 15)`; call the API instead. Example: Sandy, Arid, Tomato, 12 acres → backend returns `{ waterLitersPerWeek: 6600, fertilizerKg: 216 }` (real crop-specific rates, not 6000/180).

### `Dashboard.jsx`
- **Stats:** Replace hardcoded `weeklyData`, `analysisData`, `pieData` with `api.admin.getDashboardStats()`:
  - `totalImages` → Total images card
  - `diseaseDistribution` / `mostCommonDiseases` → Pie chart, disease breakdown
  - `dailyAnalysis` → Line chart (map `{ date, count }` to `{ name, v }` for recharts)
- **Messages:** Add a Messages panel that calls `api.admin.getMessages()`; add UI to mark read/archived via `api.admin.patchMessage(id, status)`
- Route must be protected so only Admin can access (via AdminGuard)

---

## 6. API Response Shapes

### Auth & Users
- **Login/Register:** `{ token: string, user: { id, name, email, role, profileImageBase64 } }`
- **auth/me:** `{ id, name, email, role, profileImageBase64 }`
- **messages create:** `{ id, senderFirstName, senderLastName, senderEmail, senderPhone, body, status, createdAtUtc }`
- **admin/messages:** `[{ id, senderFirstName, senderLastName, senderEmail, senderPhone, body, status, createdAtUtc }]`
- **admin/dashboard-stats:** `{ totalImages, diseaseDistribution: [{ diseaseName, count, percentage }], dailyAnalysis: [{ date, count }], mostCommonDiseases: [{ diseaseName, count, percentage }] }`

### Services (Crop Recommendation & Calculator)
- **services/soil-types:** `[{ id: number, name: string }]` — e.g. Sandy, Clay, Silt
- **services/climates:** `[{ id: number, name: string }]` — e.g. Arid, Humid, Cold
- **services/crops:** `[{ id: number, name: string }]` — crops available for calculator (Tomato, Wheat, Corn, etc.)
- **services/recommendations?soilType=&climate=:** `{ crops: string[], soilType: string, climate: string }` — crop names recommended for the given soil and climate
- **services/calculate?soilType=&climate=&crop=&landArea=:** `{ waterLitersPerWeek: number, fertilizerKg: number }` — water (L/week) and fertilizer (kg) for the given land area; 404 if crop has no requirements
- **Error responses:** `{ code: string, message: string, details?: any }`

---

## 7. Admin Account

- **Email:** `admin@leafscan.com`
- **Password:** `Admin@123`

This account is created automatically when the API runs for the first time.

---

## 8. Frontend Developer Checklist

Use this checklist to track integration progress:

| # | Task | Status |
|---|------|--------|
| 1 | Add `VITE_API_URL` to Vercel environment variables | ☐ |
| 2 | Create `src/api.js` (API client with auth headers) | ☐ |
| 3 | Create `src/AuthContext.jsx` (auth state provider) | ☐ |
| 4 | Create `src/AdminGuard.jsx` (Admin route guard) | ☐ |
| 5 | Update `App.jsx`: wrap with `AuthProvider`, protect `/dashboard` with `AdminGuard` | ☐ |
| 6 | Update `Loginpage.jsx`: wire to `api.auth.login` / `api.auth.register` | ☐ |
| 7 | Update `Home.jsx`: use `useAuth()`, redirect if not authenticated | ☐ |
| 8 | Update `Contact.jsx`: add `onSubmit`, call `api.messages.create` | ☐ |
| 9 | Update `Header.jsx`: use `useAuth()`, Admin link for Admin role | ☐ |
| 10 | Update `Profile.jsx`: use `useAuth()`, wire to `api.users.updateMe` | ☐ |
| 11 | Update `Services.jsx`: wire to `api.services.*`; replace Irrigation Calculator hardcoded `(landArea * 500)` / `(landArea * 15)` with `api.services.calculate(...)` and display `waterLitersPerWeek`, `fertilizerKg` | ☐ |
| 12 | Update `Dashboard.jsx`: wire to `api.admin.getMessages`, `api.admin.getDashboardStats` | ☐ |
