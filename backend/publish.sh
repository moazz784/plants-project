#!/usr/bin/env bash
# LeafScan Backend — bash publish (macOS/Linux). Cleans output and runs dotnet publish.
# Optional: pwsh ./publish.ps1 for the production appsettings merge when appsettings.Production.json exists.

set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

echo "LeafScan Backend - Publishing..."
if [[ -d publish ]]; then
  rm -rf publish
  echo "Cleaned previous build"
fi

dotnet publish LeafScan.API -c Release -o "$ROOT/publish"

if [[ ! -f "$ROOT/LeafScan.API/appsettings.Production.json" ]]; then
  echo "Note: No appsettings.Production.json — using files from dotnet publish as-is." >&2
  echo "      For FTP overlay with stripped JSON, install PowerShell 7+: brew install pwsh && pwsh ./publish.ps1" >&2
fi

echo "Publish complete! Output: $ROOT/publish/"
