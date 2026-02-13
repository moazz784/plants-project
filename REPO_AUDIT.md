# Step 1 — Repo Audit Report

**Project:** LeafScan (plants-project)  
**Audit Date:** Per mandate — zero guessing, all evidence from code.

---

## A) Routing Map

| Route | Component | Layout | File:Line | Requires Login | Requires Admin |
|-------|-----------|--------|-----------|----------------|----------------|
| `/` | Home | Header (Outlet) | `App.jsx:39` | **Yes** | No |
| `/about` | About | Header | `App.jsx:40` | No | No |
| `/services` | Services | Header | `App.jsx:41` | No | No |
| `/contact-us` | Contact | Header | `App.jsx:42` | No | No |
| `/plants` | Plantscategoriy | Header | `App.jsx:43` | No | No |
| `/profile` | Profile | None | `App.jsx:45` | No | No |
| `/dashboard` | Dashboard | None | `App.jsx:46` | **No** | **No** |
| `/login` | Loginpage | None | `App.jsx:47` | No | No |
| `*` | Momo (404) | None | `App.jsx:48` | No | No |

### Evidence

**Route definitions** — [`src/App.jsx`](src/App.jsx):
```jsx
37:            <Route element={<Header />}>
38:              <Route path="/" element={<Home />} />
39:              <Route path="/about" element={<About />} />
40:              <Route path="/services" element={<Services/>} />
41:            <Route path="/contact-us" element={<Contact/>} />
42:              <Route path="/plants" element={<Plantscategoriy/>} />
43:              </Route>
44:               <Route path="/profile" element={<Profile />} />
45:                 <Route path="/dashboard" element={<Dashboard />} />
46:              <Route path="/login" element={<Loginpage />} />
47:              <Route path="*" element={<Momo />} />
```

**Login gate** — [`src/Home.jsx`](src/Home.jsx) lines 35-40:
```jsx
useEffect(() => {
  const hasloged = localStorage.getItem("hasloged") === "true";
  if (!hasloged) {
    navigate("/login");
  }
}, [navigate]);
```

No other route performs auth. Dashboard has no role or auth check.

---

## B) Data Storage Audit

### localStorage

| Key | JSON Shape | Read | Write | Purpose |
|-----|------------|------|-------|---------|
| `hasloged` | `"true"` (string) | Home.jsx:36 | Loginpage.jsx:16, 37; Header.jsx:87 (remove) | Auth gate |
| `user_data` | `{ name: string, image: string|null, password?: string }` | Header.jsx:21,26; Profile.jsx:14 | Loginpage.jsx:23,36; Header.jsx:47; Profile.jsx:23 | User profile + auth state |

### sessionStorage

Not used.

### In-memory / mock database

- Dashboard uses hardcoded `weeklyData`, `analysisData`, `pieData` — [`src/Dashboard.jsx`](src/Dashboard.jsx) lines 10-25.
- Plants encyclopedia data in i18n.jsx (`plants` array) — static.

### Evidence

**hasloged**
- Write: [`Loginpage.jsx`](src/Loginpage.jsx) L16 (login), L37 (signup)
- Remove: [`Header.jsx`](src/Header.jsx) L87 (`handleLogout`)
- Read: [`Home.jsx`](src/Home.jsx) L36

**user_data**
- Shape from [`Loginpage.jsx`](src/Loginpage.jsx) L21-24 (login default), L30-36 (signup):
  ```js
  { name: "User", image: null }  // or { name: values.name, image: null }
  ```
- Profile extends with `password` ([`Profile.jsx`](src/Profile.jsx) L22):
  ```js
  { ...savedData, name: values.name, password: values.password }
  ```
- Header stores base64 image ([`Header.jsx`](src/Header.jsx) L44-47):
  ```js
  const updatedData = { ...userData, image: reader.result };
  localStorage.setItem("user_data", JSON.stringify(updatedData));
  ```
- Read: [`Header.jsx`](src/Header.jsx) L21, L26; [`Profile.jsx`](src/Profile.jsx) L14

### i18n localStorage

[`src/i18n.jsx`](src/i18n.jsx) L540-542 — `i18next-browser-languagedetector` uses `localStorage` for language; not auth-related.

---

## C) Forms and Workflows

### 1. Login

| Item | Detail |
|------|--------|
| File | [`src/Loginpage.jsx`](src/Loginpage.jsx) |
| Fields | `email`, `password` |
| Validation | `yup`: email required+email, password required+min(5) — L42-45 |
| Submit | `handleSubmit` L15-27: sets `hasloged`, `user_data` (or default), toast, `navigate("/")` |
| Failure | `ErrorMessage` only; no backend validation |
| Success | toast "login_success", redirect to Home |

**Evidence L42-45, L65-69:**
```js
const validationscema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(5),
});
// Formik validationSchema={validationscema} onSubmit={handleSubmit}
```

### 2. Signup

| Item | Detail |
|------|--------|
| File | [`src/Loginpage.jsx`](src/Loginpage.jsx) |
| Fields | `name`, `email`, `password` |
| Validation | `yup`: name min(3), email email+required, password min(6)+required — L46-50 |
| Submit | `handleSignup` L29-40: sets `user_data`, `hasloged`, toast, `navigate("/")` |
| Success | toast "signup_success", redirect to Home |

**Evidence L46-50:**
```js
const signupSchema = yup.object({
  name: yup.string().min(3).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});
```

### 3. Profile Update

| Item | Detail |
|------|--------|
| File | [`src/Profile.jsx`](src/Profile.jsx) |
| Fields | `name`, `password` (optional) |
| Validation | name min(3)+required, password min(6) if provided, notRequired — L16-18 |
| Submit | `handleSubmit` L21-25: merges into `user_data`, saves to localStorage, toast, `navigate("/")` |
| Success | toast "save_success", redirect to Home |
| Image | Handled in Header dropdown (L39-51) — FileReader base64, stored in `user_data.image` |

**Evidence L16-18, L32-36:**
```js
initialValues={{ name: '', password: '' }}  // Note: doesn't prefill from savedData
validationSchema: name min(3) required, password min(6) notRequired
```

### 4. Contact Form

| Item | Detail |
|------|--------|
| File | [`src/Contact.jsx`](src/Contact.jsx) |
| Fields | first_name, last_name, email, phone_number, message (i18n keys L183-191) |
| Validation | None |
| Submit handler | **None** — form has no `onSubmit` |
| Inputs | No `name` attributes (L77-122) |
| Success/Failure | Not implemented |

**Evidence** — [`src/Contact.jsx`](src/Contact.jsx) L72-137:
```jsx
<form className="grid ...">
  <input type="text" ... />   // first_name - no name attr
  <input type="text" ... />   // last_name
  <input type="email" ... />  // email
  <input type="text" ... />  // phone_number
  <textarea ... />           // message
  <button type="submit" ...>{t("send_btn")}</button>
</form>
```

### 5. Dashboard Actions

| Item | Detail |
|------|--------|
| File | [`src/Dashboard.jsx`](src/Dashboard.jsx) |
| Actions | No real submit/API; purely UI |
| Sidebar | Home link (navigate), Messages (static label, no handler) |
| Charts | Static data only |

**Evidence** L56-58:
```jsx
<div className="p-2 ... MessageSquare ...">
  <span>Messages</span>  // No onClick, no list, no fetch
</div>
```

---

## D) Messages / Contact Workflow Proof

### Where users submit messages

- [`src/Contact.jsx`](src/Contact.jsx) — `/contact-us` page.
- Form fields (from i18n): `first_name`, `last_name`, `email`, `phone_number`, `message`.
- No submit logic; form does nothing.

### Where admin reads messages

- Dashboard has a "Messages" label in the sidebar ([`Dashboard.jsx`](src/Dashboard.jsx) L56-58).
- No list, no fetch, no handler.
- Intended workflow: Admin sees messages from users; implementation absent.

### Message fields (from form + i18n)

| Field | i18n key | Source |
|-------|----------|--------|
| First Name | first_name | Contact.jsx L76 |
| Last Name | last_name | L84 |
| Email | email | L94 |
| Phone | phone_number | L104 |
| Message | message / message_placeholder | L116 |

### Current storage

- **None** — no localStorage, no state persistence.
- Form is presentational only.

---

## E) Role Proof

| Check | Result |
|-------|--------|
| Admin flag in user_data | No — `user_data` only has `name`, `image`, optionally `password` |
| Hardcoded admin credentials | No |
| Route guards by role | No |
| Dashboard visibility by role | No — Dashboard link commented out in Header L108, L234 |
| Role in codebase | No references to "admin", "Admin", or role checks |

**Evidence** — [`src/Header.jsx`](src/Header.jsx) L107-108:
```jsx
{/* <NavLink to="/dashboard" ...>Dashboard</NavLink> */}
```

**Conclusion:** Role-based logic is not implemented. All users are treated the same.

---

## F) Backend Contract Plan

### F1) Entities and Relationships

```
Users (Id GUID, Name, Email UK, PasswordHash, Role, ProfileImageBase64/Url, CreatedAtUtc, UpdatedAtUtc)
  └── 1:many Messages (SenderUserId nullable for guest; otherwise required)

Messages (Id GUID, SenderUserId FK?, SenderFirstName, SenderLastName, SenderEmail, SenderPhone, Body, Status, CreatedAtUtc)
```

- `Users.Role`: `"User"` | `"Admin"` (nvarchar 20).
- `Messages.Status`: `"New"` | `"Read"` | `"Archived"` (for future).
- `ProfileImageBase64`: frontend uses `FileReader.readAsDataURL`; backend will accept base64 or URL and store accordingly.

### F2) Endpoints by Module

#### Auth

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| POST | `/api/auth/register` | No | — | Create User (role=User) |
| POST | `/api/auth/login` | No | — | Return JWT |
| GET | `/api/auth/me` | JWT | User/Admin | Current user + role |

#### Profile

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| PUT | `/api/users/me` | JWT | User/Admin | Update name, password (if provided), image |

#### Messages (Contact)

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| POST | `/api/messages` | JWT | User | Send contact message (optional: guest if allowed) |

#### Admin Dashboard

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| GET | `/api/admin/messages` | JWT | Admin | List all contact messages |
| PATCH | `/api/admin/messages/{id}` | JWT | Admin | Mark read/archived |

### F3) Authorization Rules

- Any `/api/admin/*` requires JWT + `Role = "Admin"`.
- `PUT /api/users/me` — user can update only their own profile.
- `POST /api/messages` — requires User (or guest if we decide to allow).
- `GET /api/auth/me` — any authenticated user.

### F4) Validation Rules (from frontend evidence)

| Field | Rules |
|-------|-------|
| name (login/signup) | min 3, required |
| email | valid email, required |
| password (login) | required, min 5 |
| password (signup) | required, min 6 |
| password (profile) | optional, min 6 if provided |
| first_name | required, max 100 |
| last_name | required, max 100 |
| email (contact) | required, valid email |
| phone_number | optional, max 20 |
| message/body | required, max 2000 |

---

## Inconsistencies and Resolutions

1. **Contact form has no submit handler**  
   → Add `onSubmit`, collect values, POST to `/api/messages`. Add `name` attributes to inputs.

2. **Dashboard has no messages list**  
   → Add a Messages section/panel that calls `GET /api/admin/messages` (Admin only).

3. **Profile stores password in localStorage**  
   → Backend: never return password; accept `newPassword` in PUT; hash server-side.

4. **Profile initialValues empty**  
   → Populate from `GET /api/auth/me` (or `user_data` until wired).

5. **Login validation inconsistent**  
   → Login: min 5; Signup: min 6. Backend: enforce min 6 for registration; login validates against hash.

6. **Guest messages**  
   → Requirement: User sends messages. Assumption: only authenticated users send messages. `SenderUserId` required; no guest flow unless requested.

---

## Plan Consistency Check

| Requirement | Evidence | Plan |
|-------------|----------|------|
| 2 roles: User, Admin | None in frontend | Add Role to Users; JWT includes role |
| Admin: Dashboard + view messages | Dashboard has Messages label; no list | GET /api/admin/messages; add messages UI |
| User: send messages | Contact form exists; no submit | POST /api/messages; wire form |
| User: no admin endpoints | No guards | 403 for non-Admin on /api/admin/* |

**Status:** Audit complete. Plan is consistent with repo evidence. Ready for Step 2 (Backend Architecture) upon approval.
