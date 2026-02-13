@echo off
REM LeafScan Backend - Publish script
REM Double-click publish.bat (NOT publish.ps1)

cd /d "%~dp0"
echo.
echo Starting publish...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0publish.ps1"
echo.
echo Press any key to close...
pause >nul
