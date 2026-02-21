# Frontend Integration Instructions

The LeafScan backend (ASP.NET Core API) is deployed separately. To connect your Vercel frontend to it, follow these steps.
Credentials 
admin : admin@LeafScans.com
pass : 123456789
---

## 1. Environment Variable (Vercel)

Add this in your Vercel project **Settings → Environment Variables**:

| Name | Value |
|------|-------|
| `VITE_API_URL` | Your backend API base URL, e.g. `https://plantgraduationproject.runasp.net/api` |

- **Local:** Defaults to `http://localhost:5128/api` when not set
- **Production:** Must be set for the frontend (including Services calculators) to reach the backend

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
  services: {
    getRecommendations: (soilType, climate) =>
      api.get(`/services/recommendations?soilType=${encodeURIComponent(soilType)}&climate=${encodeURIComponent(climate)}`),
    calculate: (soilType, climate, crop, landArea) =>
      api.get(`/services/calculate?soilType=${encodeURIComponent(soilType)}&climate=${encodeURIComponent(climate)}&crop=${encodeURIComponent(crop)}&landArea=${encodeURIComponent(landArea)}`),
    getSoilTypes: () => api.get('/services/soil-types'),
    getClimates: () => api.get('/services/climates'),
    getCrops: () => api.get('/services/crops'),
  },
  admin: {
    getMessages: () => api.get('/admin/messages'),
    patchMessage: (id, status) => api.patch(`/admin/messages/${id}`, { status }),  // status: "Read" | "Archived"  // status: "Read" | "Archived"
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

### `Dashboard.jsx`
- Replace hardcoded data with `api.admin.getMessages()`
- Add UI to mark messages as read/archived via `api.admin.patchMessage(id, status)`
- Route must be protected so only Admin can access (via AdminGuard)

### `Services.jsx` – Select Best Crops
- Call `api.services.getRecommendations(soilType, climate)` when the user clicks "Get Recommendation"
- On success: display `response.crops` — join with `" & "` for display, e.g. `crops.join(" & ")`
- Response shape: `{ crops: string[], soilType: string, climate: string }` — e.g. `{ crops: ["Watermelon","Peanuts","Sorghum"], soilType: "Sandy", climate: "Arid" }`
- If no matches, `crops` is an empty array `[]`
- Add loading state and use `getErrorMessage(err)` for errors

### `Services.jsx` – Irrigation & Fertilization Calculator
- Call `api.services.calculate(soilType, climate, crop, parseFloat(landArea))` when the user clicks "Get Best Result"
- On success: display `waterLitersPerWeek` with `t("liters_week")` and `fertilizerKg` with `t("kg_unit")`
- On error (404): show `getErrorMessage(err)` — crop not found or has no irrigation data
- Add loading state during the request (e.g. disable button, show spinner)

### `Services.jsx` – Dropdown options (both calculators)
- Option A: Keep hardcoded lists, expand to match DB — `['Sandy','Clay','Silt','Loam']`, `['Arid','Humid','Cold','Temperate','Tropical']`, and all 16 crops
- Option B: Load from API on mount — `useEffect` to call `api.services.getSoilTypes()`, `getClimates()`, `getCrops()` and populate dropdowns
- No auth required; all services endpoints are public

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
