# LeafScan Backend API

ASP.NET Core 8 Web API for LeafScan plant diagnostic application.

## Admin Seed Account

After first run, the following admin account is created:

- **Email:** `admin@leafscan.com`
- **Password:** `Admin@123`

Use these credentials to log in as Admin and access the Dashboard and `/api/admin/messages`.

## Running locally

```bash
dotnet run --project LeafScan.API
```

API: https://localhost:7xxx (check console for port)
Swagger: https://localhost:7xxx/swagger

## Endpoints

### Auth
- `POST /api/auth/register` - Register (creates User role)
- `POST /api/auth/login` - Login, returns JWT
- `GET /api/auth/me` - Current user (requires auth)

### Users
- `PUT /api/users/me` - Update profile (name, password, image)

### Messages
- `POST /api/messages` - Send contact message (requires auth)

### Admin (requires Admin role)
- `GET /api/admin/messages` - List all messages
- `PATCH /api/admin/messages/{id}` - Mark read/archived

## CORS

Configured for:
- `http(s)://localhost:*` (Vite dev)
- Any `*.vercel.app` subdomain (including preview deployments)

## Deployment (runasp.net)

### 1. Create database

Run the SQL script in your SQL Server database (e.g. monsterasp/runasp):
- File: `LeafScan.Infrastructure/SqlScripts/LeafScan_Schema_And_Seed.sql`
- Creates all tables: Users, Messages, Diseases, Plants, AiChatbots, ChatSessions, PlantImages, SoilData, UserChats, Diagnoses, UserPlantImages, Reports, __EFMigrationsHistory

### 2. Publish the API

**Easy way:** Run the publish script from the `backend` folder:
```powershell
.\publish.ps1
```
Or double-click `publish.bat`. This stops any running API first, then publishes to `./publish`.

**Manual way:** From the `backend` folder:

```bash
dotnet publish LeafScan.API -c Release -o ./publish
```

Output will be in `backend/publish/` (DLLs, appsettings.json, web.config, etc.).

### 3. Upload via FTP/SFTP

Using FileZilla or similar:

| Field | Value |
|-------|-------|
| Host | `plantgraduationproject.runasp.net` (use your runasp FTP host) |
| Port | 21 (FTP) or 22 (SFTP) |
| Username | Your FTP login |
| Password | Your FTP password |
| Remote path | `/wwwroot` |

**Upload all contents** of the `publish` folder into `/wwwroot`. Do not upload the `publish` folder itself — upload its contents so that `LeafScan.API.exe`, `web.config`, `appsettings.json`, and the rest are directly inside `wwwroot`.

### 4. App Settings

In your hosting control panel, add environment variables or app settings:

- `ConnectionStrings__DefaultConnection` = your SQL Server connection string
- `Jwt__Key` = strong secret key (min 32 chars) for JWT signing — or add to `appsettings.Production.json` (gitignored)
- `ASPNETCORE_ENVIRONMENT` = `Production`

### 5. Vercel (frontend)

Add `VITE_API_URL` pointing to your API, e.g. `https://plantgraduationproject.runasp.net/api`
