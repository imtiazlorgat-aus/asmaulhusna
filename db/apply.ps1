param(
  [ValidateSet("all", "migrations", "seeds")]
  [string]$Mode = "all"
)

$ErrorActionPreference = "Stop"

if (-not $env:DATABASE_URL) {
  Write-Error "DATABASE_URL environment variable is not set."
  exit 1
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

function Invoke-Folder {
  param([string]$Folder)

  $path = Join-Path $scriptDir $Folder
  if (-not (Test-Path $path)) {
    Write-Error "Folder not found: $path"
    exit 1
  }

  Write-Host "==> Applying $Folder/" -ForegroundColor Cyan
  Get-ChildItem -Path $path -Filter "*.sql" | Sort-Object Name | ForEach-Object {
    Write-Host "  - $($_.Name)"
    & psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -q -f $_.FullName
    if ($LASTEXITCODE -ne 0) {
      Write-Error "psql failed on $($_.Name)"
      exit $LASTEXITCODE
    }
  }
}

switch ($Mode) {
  "migrations" { Invoke-Folder "migrations" }
  "seeds"      { Invoke-Folder "seeds" }
  "all"        { Invoke-Folder "migrations"; Invoke-Folder "seeds" }
}

Write-Host "Done." -ForegroundColor Green
