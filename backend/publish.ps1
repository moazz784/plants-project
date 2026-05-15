# LeafScan Backend - Publish script (Windows + macOS / Linux with PowerShell 7+)
# Usage: pwsh ./publish.ps1   (don't use ./publish.ps1 alone in bash/zsh unless executable + pwsh shebang)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "LeafScan Backend - Publishing..." -ForegroundColor Cyan

# Clean previous builds
if (Test-Path "publish") {
    Remove-Item -Recurse -Force "publish"
    Write-Host "Cleaned previous build" -ForegroundColor Yellow
}

# Stop any running LeafScan.API to avoid file lock errors (Windows only)
$publishIsWindowsDesktop = ($PSVersionTable.PSEdition -eq 'Desktop')
$publishIsPsCoreWindows = ($PSVersionTable.PSEdition -eq 'Core' -and $IsWindows)
if ($publishIsWindowsDesktop -or $publishIsPsCoreWindows) {
    Write-Host "Checking for running LeafScan.API..." -ForegroundColor Gray
    Get-Process -Name "LeafScan.API" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
}

Write-Host "Running dotnet publish..." -ForegroundColor Gray
dotnet publish (Join-Path $PSScriptRoot "LeafScan.API") -c Release -o (Join-Path $PSScriptRoot "publish")
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nPublish failed." -ForegroundColor Red
    exit 1
}

$publishDir = Join-Path $PSScriptRoot "publish"
$prodPath = Join-Path (Join-Path $PSScriptRoot "LeafScan.API") "appsettings.Production.json"

if (Test-Path $prodPath) {
    $prod = Get-Content -Path $prodPath -Raw | ConvertFrom-Json
    $connStr = $prod.ConnectionStrings.DefaultConnection -replace '"', '\"'
    $jwtKey = $prod.Jwt.Key -replace '"', '\"'
    $deployJson = "{`"Logging`":{`"LogLevel`":{`"Default`":`"Information`",`"Microsoft.AspNetCore`":`"Warning`"}},`"AllowedHosts`":`"plantgraduationproject.runasp.net;*.runasp.net;*`",`"ConnectionStrings`":{`"DefaultConnection`":`"$connStr`"},`"Jwt`":{`"Key`":`"$jwtKey`",`"Issuer`":`"LeafScan`",`"Audience`":`"LeafScan`"}}"
    [System.IO.File]::WriteAllText((Join-Path $publishDir "appsettings.json"), $deployJson, [System.Text.UTF8Encoding]::new($false))
    Write-Host "Deployment appsettings.json updated with production config" -ForegroundColor Gray
} else {
    Write-Host "Missing appsettings.Production.json — keeping appsettings emitted by dotnet publish." -ForegroundColor Yellow
}

Write-Host "`nPublish complete! Output: publish/" -ForegroundColor Green
Write-Host "Upload the contents of this folder via FTP/hosting tooling." -ForegroundColor Gray
