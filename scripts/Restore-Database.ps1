. "$PSScriptRoot\functions\Initialize-Environment.ps1"

function Restore-Database {
    Write-Host "[INFO] Avvio del ripristino del database" -ForegroundColor Magenta

    $backupFile = "$global:RESTORE_FOLDER\gestionale-wasabi.dump"

    if (!(Test-Path $backupFile)) {
        Write-Host "[ERRORE] Nessuna file di backup trovato in $global:RESTORE_FOLDER. Ripristino impossibile!" -ForegroundColor Red
        exit 1
    }

    Write-Host "[INFO] Ripristino del database da: $backupFile" -ForegroundColor Magenta
    & psql -U $env:PGUSER -h $env:PGHOST -p $env:PGPORT -d $env:PGDATABASE --clean "$backupFile"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRORE] Ripristino del database fallito!" -ForegroundColor Red
        exit 1
    }
}

$env:PGUSER = "postgres"
$env:PGDATABASE = "gestionale-wasabi"
$env:PGHOST = "localhost"
$env:PGPORT = "5432"
$env:PGPASSWORD = ""
$global:PRIMARY_RESTORE_FOLDER = "F:\backup"
$global:FALLBACK_RESTORE_FOLDER = (Get-Item $PSScriptRoot).Parent.FullName + "\backup"

if (Test-Path $PRIMARY_RESTORE_FOLDER) {
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