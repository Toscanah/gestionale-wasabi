. "$PSScriptRoot/functions/Get-OS.ps1"
. "$PSScriptRoot/functions/Initialize-Environment.ps1"

$OS = Get-OS
Write-Host "[INFO] Rilevato sistema operativo: $OS" -ForegroundColor Magenta

function New-Backup-Folder {
    Write-Host "[INFO] Verifica della cartella di backup" -ForegroundColor Magenta
    $localBackupFolder = Join-Path (Get-Item $PSScriptRoot).Parent.FullName "backup"

    if (!(Test-Path $localBackupFolder)) {
        Write-Host "Creazione della cartella di backup sul PC: $localBackupFolder"
        New-Item -ItemType Directory -Path $localBackupFolder | Out-Null
        Write-Host "[SUCCESSO] Cartella di backup sul PC creata: $localBackupFolder" -ForegroundColor Green
    }
    else {
        Write-Host "La cartella di backup sul PC esiste gia': $localBackupFolder"
    }

    $usbBackupFolder = $null
    if ($OS -eq "Windows") {
        if (Test-Path "F:\") {
            $usbBackupFolder = "F:\backup"
        }
    }
    elseif ($OS -eq "MacOS") {
        if (Test-Path "/Volumes/USB") {
            $usbBackupFolder = "/Volumes/USB/backup"
        }
    }

    if ($usbBackupFolder) {
        Write-Host "USB rilevata. Backup aggiuntivo in: $usbBackupFolder"

        if (!(Test-Path $usbBackupFolder)) {
            Write-Host "Creazione della cartella di backup su USB"
            New-Item -ItemType Directory -Path $usbBackupFolder | Out-Null
            Write-Host "[SUCCESSO] Cartella di backup su USB creata: $usbBackupFolder `n" -ForegroundColor Green
        }
        else {
            Write-Host "La cartella di backup esiste gia' su USB: $usbBackupFolder `n"
        }
    }
    else {
        Write-Host "Nessuna USB rilevata. Il backup verra' salvato solo localmente. `n"
    }

    $global:BACKUP_FOLDER = $localBackupFolder
    $global:USB_BACKUP_FOLDER = $usbBackupFolder

    # Suprress warning
    $null = $global:BACKUP_FOLDER
    $null = $global:USB_BACKUP_FOLDER
}

function Backup-Database {
    Write-Host "[INFO] Avvio del backup del database" -ForegroundColor Magenta

    $pcBackupFile = Join-Path $global:BACKUP_FOLDER "$env:PGDATABASE.dump"
    $usbBackupFile = if ($global:USB_BACKUP_FOLDER) { Join-Path $USB_BACKUP_FOLDER "$env:PGDATABASE.dump" } else { $null }

    Write-Host "Eseguo il dump del database sul PC in: $pcBackupFile"

    $pcBackupTime = Measure-Command {
        & pg_dump -U $env:PGUSER -d $env:PGDATABASE -h $env:PGHOST -p $env:PGPORT -c -F p -f "$pcBackupFile"
    }

    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRORE] Backup fallito sul PC `n" -ForegroundColor Red
        exit 1
    }
    else {
        Write-Host "[SUCCESSO] Backup completato sul PC: $pcBackupFile ($($pcBackupTime.TotalSeconds) sec) `n" -ForegroundColor Green
    }

    if ($global:USB_BACKUP_FOLDER) {
        Write-Host "Eseguo il dump del database sulla USB in: $usbBackupFile"

        $usbBackupTime = Measure-Command {
            & pg_dump -U $env:PGUSER -d $env:PGDATABASE -h $env:PGHOST -p $env:PGPORT -c -F p -f "$usbBackupFile"
        }

        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ERRORE] Backup fallito su USB `n" -ForegroundColor Red
        }
        else {
            Write-Host "[SUCCESSO] Backup completato sulla USB: $usbBackupFile ($($usbBackupTime.TotalSeconds) sec) `n" -ForegroundColor Green
        }
    }
}

$env:PGUSER = "postgres"
$env:PGDATABASE = "gestionale-wasabi"
$env:PGHOST = "localhost"
$env:PGPORT = "5432"
$env:PGPASSWORD = ""

Initialize-Environment
New-Backup-Folder
Backup-Database

for ($i = 5; $i -ge 0; $i--) {
    Write-Host "`rQuesta schermata si chiudera' fra $i secondi" -NoNewline -ForegroundColor Magenta
    Start-Sleep 1
}

exit 0
