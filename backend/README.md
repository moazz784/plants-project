# LeafScan Backend API

ASP.NET Core 8 REST API for the LeafScan plant disease diagnostic platform.

---

## Architecture

```
backend/
├── LeafScan.API            Controllers, middleware, DI wiring, cookie helpers
├── LeafScan.Application    DTOs, validators, service interfaces
├── LeafScan.Domain         Entity models (no dependencies)
└── LeafScan.Infrastructure Data access (EF Core), service implementations
```

Data flows: `Controller → IService (Application) → Service impl (Infrastructure) → DbContext`

---

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server (local or remote)

---

## Local Setup

1. **Configure connection string** — edit `LeafScan.API/appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=LeafScan;Trusted_Connection=True;TrustServerCertificate=True"
     }
   }
   ```

2. **Apply migrations** (creates all tables):
   ```bash
   dotnet ef database update --project LeafScan.Infrastructure --startup-project LeafScan.API
   ```

3. **Run the API:**
   ```bash
   dotnet run --project LeafScan.API
   ```
   - API: `https://localhost:<port>` (port shown in console)
   - Swagger UI: `https://localhost:<port>/swagger`

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ConnectionStrings__DefaultConnection` | Yes | SQL Server connection string |
| `Jwt__Key` | Yes | Secret key for JWT signing (min 32 chars) |
| `Jwt__Issuer` | No | JWT issuer (default: `LeafScan`) |
| `Jwt__Audience` | No | JWT audience (default: `LeafScan`) |
| `PythonApiUrl` | Yes | URL of the FastAPI ML microservice |
| `KimiApiKey` | Yes | Kimi AI API key for the chatbot |
| `ASPNETCORE_ENVIRONMENT` | No | `Production` or `Development` |

---

## Authentication

The API uses **JWT Bearer tokens** stored in **HttpOnly cookies** — never exposed to JavaScript.

### Token flow

1. **Login or Register** → server sets two cookies:
   - `leafscan_access_token` — short-lived JWT (15 minutes), used on every request
   - `leafscan_refresh_token` — opaque random token (7 days), scoped to `/api/auth/refresh`

2. **Authenticated requests** — browser sends `leafscan_access_token` cookie automatically. No client-side token handling needed.

3. **Token expired (401)** → call `POST /api/auth/refresh`. If the refresh token is still valid, both cookies are rotated and a fresh session continues transparently.

4. **Logout** → both cookies are cleared.

### Password security

Passwords are hashed with **BCrypt** before storage. Plain-text passwords are never persisted.

---

## API Reference

### Auth — `/api/auth`

#### `POST /api/auth/register`
Register a new user account.

**Body:**
```json
{ "name": "Alice", "email": "alice@example.com", "password": "Secret@123" }
```

**Response `200`:**
```json
{ "user": { "id": "...", "name": "Alice", "email": "alice@example.com", "role": "User", "profileImageBase64": null } }
```
Sets `leafscan_access_token` and `leafscan_refresh_token` cookies.

**Errors:** `400 VALIDATION_ERROR`, `400 EMAIL_EXISTS`

---

#### `POST /api/auth/login`
Authenticate with email and password.

**Body:**
```json
{ "email": "alice@example.com", "password": "Secret@123" }
```

**Response `200`:** same shape as register.
Sets `leafscan_access_token` and `leafscan_refresh_token` cookies.

**Errors:** `400 VALIDATION_ERROR`, `401 INVALID_CREDENTIALS`

---

#### `POST /api/auth/refresh`
Exchange a valid refresh token for new access + refresh tokens. Rotates the refresh token on every call.

Reads the refresh token from the `leafscan_refresh_token` cookie automatically. Optionally accepts it in the request body for non-browser clients:
```json
{ "refreshToken": "<token>" }
```

**Response `200`:** same user shape; both cookies are updated.

**Errors:** `401 MISSING_REFRESH_TOKEN`, `401 INVALID_REFRESH_TOKEN`

---

#### `POST /api/auth/logout`
Clears both auth cookies.

**Response `200`:** `{}`

---

#### `GET /api/auth/me` — *requires auth*
Returns the currently authenticated user.

**Response `200`:**
```json
{ "id": "...", "name": "Alice", "email": "alice@example.com", "role": "User", "profileImageBase64": null }
```

**Errors:** `401`, `404 USER_NOT_FOUND`

---

### Users — `/api/users`

#### `PUT /api/users/me` — *requires auth*
Update the current user's profile.

**Body:**
```json
{ "name": "Alice B.", "newPassword": "NewSecret@456", "profileImageBase64": "data:image/png;base64,..." }
```
All fields except `name` are optional. Omit `newPassword` to leave the password unchanged.

**Response `200`:** updated user object (same shape as `/auth/me`).

**Errors:** `401`, `400 VALIDATION_ERROR`, `404 USER_NOT_FOUND`

---

### Messages — `/api/messages`

#### `POST /api/messages` — *requires auth*
Submit a contact/support message.

**Body:**
```json
{ "subject": "Question about irrigation", "body": "How do I use the calculator?" }
```

**Response `201`:** created message object.

**Errors:** `401`, `400 VALIDATION_ERROR`

---

### Plant Disease — `/api/plant`

#### `POST /api/plant/predict`
Upload a leaf image for disease classification. Forwards the image to the Python FastAPI microservice.

**Body:** `multipart/form-data` — field `image` (JPEG / PNG / WebP, max 10 MB).

**Response `200`:**
```json
{
  "predicted_class": "Tomato___Late_blight",
  "confidence": 0.9472,
  "top3": [
    { "class": "Tomato___Late_blight", "confidence": 0.9472 },
    { "class": "Tomato___Early_blight", "confidence": 0.0381 },
    { "class": "Tomato___healthy", "confidence": 0.0089 }
  ]
}
```

#### `GET /api/plant/health`
Checks whether the ML model is loaded and ready.

**Response `200`:** `{ "status": "ok" }`

---

### Crop Services — `/api/services`

#### `GET /api/services/soil-types`
Returns the list of supported soil types.

#### `GET /api/services/climates`
Returns the list of supported climate zones.

#### `GET /api/services/crops`
Returns the full crop catalog.

#### `GET /api/services/recommendations`
Returns crop recommendations based on soil and climate query parameters.

#### `POST /api/services/calculate`
Calculates irrigation requirements.

**Body:** soil and climate parameters (see Swagger for full schema).

---

### Chat — `/api/chat`

#### `POST /api/chat` — *requires auth*
Send a message to the Kimi AI agricultural chatbot.

**Body:**
```json
{ "message": "What fertilizer should I use for tomatoes?" }
```

**Response `200`:**
```json
{ "reply": "For tomatoes, a balanced NPK fertilizer..." }
```

---

### Admin — `/api/admin` — *requires Admin role*

#### `GET /api/admin/messages`
List all contact messages (newest first).

#### `PATCH /api/admin/messages/{id}`
Update message status (e.g. mark as read or archived).

**Body:**
```json
{ "status": "Read" }
```

#### `DELETE /api/admin/messages/{id}`
Delete a message permanently.

---

## Error Response Shape

All error responses follow this structure:
```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable description",
  "details": [...]
}
```

Common codes: `VALIDATION_ERROR`, `EMAIL_EXISTS`, `INVALID_CREDENTIALS`, `MISSING_REFRESH_TOKEN`, `INVALID_REFRESH_TOKEN`, `USER_NOT_FOUND`.

---

## CORS Policy

Credentials (cookies) are allowed from:
- `http://localhost:*` and `https://localhost:*` — Vite dev server
- `https://*.vercel.app` — preview and production deployments
- `capacitor://localhost` — Capacitor Android app

---

## Database

**21 entity tables.** Key ones:

| Table | Purpose |
|---|---|
| `Users` | Accounts; includes `RefreshToken` and `RefreshTokenExpiresAtUtc` columns |
| `Messages` | Contact messages from users |
| `Plants` | User plant records |
| `PlantImages` | Leaf images uploaded for diagnosis |
| `Diagnoses` | Links an image to a detected disease |
| `SoilData` | Soil properties per plant |
| `Crops`, `SoilTypes`, `Climates`, `CropRequirements` | Crop recommendation reference data |
| `ChatSessions`, `KimiChatMessages` | AI chat history |

### Admin seed account

Created automatically on first migration/run:

| Field | Value |
|---|---|
| Email | `admin@leafscan.com` |
| Password | `Admin@123` |

---

## Deployment (runasp.net)

### 1. Create the database

Run the SQL setup script against your SQL Server database:
```
LeafScan.Infrastructure/SqlScripts/LeafScan_Schema_And_Seed.sql
```
This creates all tables and inserts the admin seed account.

> If you already have a database from a previous deploy, run migrations instead:
> ```bash
> dotnet ef database update --project LeafScan.Infrastructure --startup-project LeafScan.API
> ```

### 2. Publish

From the `backend` folder:
```powershell
.\publish.ps1
```
Or manually:
```bash
dotnet publish LeafScan.API -c Release -o ./publish
```
Output lands in `backend/publish/`.

### 3. Upload via FTP/SFTP

| Setting | Value |
|---|---|
| Host | Your runasp.net FTP host |
| Port | 21 (FTP) or 22 (SFTP) |
| Remote path | `/wwwroot` |

Upload the **contents** of `backend/publish/` directly into `/wwwroot` (not the folder itself).

### 4. Set environment variables

In the hosting control panel set at minimum:

```
ConnectionStrings__DefaultConnection = <your SQL Server connection string>
Jwt__Key                             = <strong random string, min 32 chars>
PythonApiUrl                         = <Hugging Face Spaces URL for the ML service>
KimiApiKey                           = <Kimi AI API key>
ASPNETCORE_ENVIRONMENT               = Production
```

### 5. Frontend

In Vercel, set:
```
VITE_API_URL = https://plantgraduationproject.runasp.net/api
```
