# LeafScan Backend - Publish script
# Run this after making changes to create/update the publish folder for FTP deployment

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "LeafScan Backend - Publishing..." -ForegroundColor Cyan

# Clean previous builds
if (Test-Path "publish") {
    Remove-Item -Recurse -Force "publish"
    Write-Host "Cleaned previous build" -ForegroundColor Yellow
}

# Stop any running LeafScan.API to avoid file lock errors
Write-Host "Checking for running LeafScan.API..." -ForegroundColor Gray
Get-Process -Name "LeafScan.API" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500

# Publish
Write-Host "Running dotnet publish..." -ForegroundColor Gray
dotnet publish LeafScan.API -c Release -o ./publish

# Overwrite appsettings.json with production config for deployment
# (server needs production connection string - LocalDB does not exist on host)
$prod = Get-Content -Path "LeafScan.API\appsettings.Production.json" -Raw | ConvertFrom-Json
$connStr = $prod.ConnectionStrings.DefaultConnection -replace '"', '\"'
$jwtKey = $prod.Jwt.Key -replace '"', '\"'
$deployJson = "{`"Logging`":{`"LogLevel`":{`"Default`":`"Information`",`"Microsoft.AspNetCore`":`"Warning`"}},`"AllowedHosts`":`"plantgraduationproject.runasp.net;*.runasp.net;*`",`"ConnectionStrings`":{`"DefaultConnection`":`"$connStr`"},`"Jwt`":{`"Key`":`"$jwtKey`",`"Issuer`":`"LeafScan`",`"Audience`":`"LeafScan`"}}"
[System.IO.File]::WriteAllText("$PWD\publish\appsettings.json", $deployJson, [System.Text.UTF8Encoding]::new($false))
Write-Host "Deployment appsettings.json updated with production config" -ForegroundColor Gray

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nPublish complete! Output: backend\publish\" -ForegroundColor Green
    Write-Host "Upload the contents of this folder to /wwwroot via FTP." -ForegroundColor Gray
} else {
    Write-Host "`nPublish failed." -ForegroundColor Red
    exit 1
}
