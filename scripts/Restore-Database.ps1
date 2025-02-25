. "$PSScriptRoot\functions\Initialize-Environment.ps1"
. "$PSScriptRoot/functions/Get-OS.ps1"

$OS = Get-OS
Write-Host "[INFO] Rilevato sistema operativo: $OS" -ForegroundColor Magenta

function Restore-Database {
    Write-Host "[INFO] Avvio del ripristino del database" -ForegroundColor Magenta

    $backupFile = Join-Path $global:RESTORE_FOLDER "$env:PGDATABASE.dump"

    if (!(Test-Path $backupFile)) {
        Write-Host "[ERRORE] Nessun file di backup trovato in $global:RESTORE_FOLDER. Ripristino impossibile!" -ForegroundColor Red
        exit 1
    }

    Write-Host "[INFO] Ripristino del database da: $backupFile" -ForegroundColor Magenta

    $restoreTime = Measure-Command {
        & psql -U $env:PGUSER -h $env:PGHOST -p $env:PGPORT -d $env:PGDATABASE -f "$backupFile" > $null 2>&1
    }

    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRORE] Ripristino del database fallito!" -ForegroundColor Red
        exit 1
    }
    else {
        Write-Host "[SUCCESSO] Ripristino completato ($($restoreTime.TotalSeconds) sec)" -ForegroundColor Green
    }
}

$env:PGUSER = "postgres"
$env:PGDATABASE = "gestionale-wasabi"
$env:PGHOST = "localhost"
$env:PGPORT = "5432"
$env:PGPASSWORD = ""

$global:RESTORE_FOLDER = $null

if ($OS -eq "Windows") {
    $PRIMARY_RESTORE_FOLDER = "F:\backup"
}
elseif ($OS -eq "MacOS") {
    $PRIMARY_RESTORE_FOLDER = "/Volumes/USB/backup"
}

$FALLBACK_RESTORE_FOLDER = Join-Path (Get-Item $PSScriptRoot).Parent.FullName "backup"

if ($PRIMARY_RESTORE_FOLDER -and (Test-Path $PRIMARY_RESTORE_FOLDER)) {
    $global:RESTORE_FOLDER = $PRIMARY_RESTORE_FOLDER
    Write-Host "[INFO] USB Backup rilevato. Ripristino da: $PRIMARY_RESTORE_FOLDER `n" -ForegroundColor Magenta
}
elseif (Test-Path $FALLBACK_RESTORE_FOLDER) {
    $global:RESTORE_FOLDER = $FALLBACK_RESTORE_FOLDER
    Write-Host "[INFO] Nessun USB trovato. Ripristino dal backup locale: $FALLBACK_RESTORE_FOLDER `n" -ForegroundColor Magenta
}
else {
    Write-Host "[ERRORE] Nessun file di backup disponibile. Interruzione del processo." -ForegroundColor Red
    exit 1
}

Initialize-Environment
Restore-Database

Write-Host "[SUCCESSO] Il ripristino dei dati e' stato completato" -ForegroundColor Green
exit 0