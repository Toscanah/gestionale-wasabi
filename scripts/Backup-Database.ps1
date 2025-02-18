. "$PSScriptRoot\functions\Initialize-Environment.ps1"

# per far funzionare: mettere enviroment varaible di postegres sql, e poi runnare da powersheel 
# Set-ExecutionPolicy RemoteSigned -Scope CurrentUser


function New-Backup-Folder {
    Write-Host "[INFO] Verifica della cartella di backup" -ForegroundColor Magenta
    $global:BACKUP_FOLDER = (Get-Item $PSScriptRoot).Parent.FullName + "\backup"

    if (!(Test-Path $BACKUP_FOLDER)) {
        Write-Host "Creazione della cartella di backup sul PC"
        New-Item -ItemType Directory -Path $BACKUP_FOLDER | Out-Null
        Write-Host "[SUCCESSO] Cartella di backup creata: $BACKUP_FOLDER `n" -ForegroundColor Green
    }
    else {
        Write-Host "La cartella di backup esiste gia': $BACKUP_FOLDER `n"
    }

    Write-Host "[INFO] Verifica della cartella di backup sulla USB" -ForegroundColor Magenta
    $global:USB_BACKUP_FOLDER = $null

    if (Test-Path "F:\") {
        $global:USB_BACKUP_FOLDER = "F:\backup"
        Write-Host "USB rilevata su F:\ - verra' eseguito un ulteriore backup all'interno di essa"

        if (!(Test-Path $USB_BACKUP_FOLDER)) {
            Write-Host "Creazione della cartella di backup su USB"
            New-Item -ItemType Directory -Path $USB_BACKUP_FOLDER | Out-Null
            Write-Host "[SUCCESSO] Cartella di backup su USB creata: $USB_BACKUP_FOLDER `n" -ForegroundColor Green
        }
        else {
            Write-Host "La cartella di backup esiste gia': $USB_BACKUP_FOLDER `n"
        }
    }
    else {
        Write-Host "USB non rilevata. Salto il backup sulla USB`n"
    }
}

function Backup-Database {
    Write-Host "[INFO] Avvio del backup del database" -ForegroundColor Magenta
    $isUSBConnected = Test-Path "F:\backup"
  
    $pcBackupFile = "$BACKUP_FOLDER\$env:PGDATABASE.dump"
    $usbBackupFile = if ($isUSBConnected) { "F:\backup\$env:PGDATABASE.dump" } else { $null }

    Write-Host "Eseguo il dump del database sul PC in: $pcBackupFile"
    & pg_dump -U $env:PGUSER -d $env:PGDATABASE -h $env:PGHOST -p $env:PGPORT -c -F p -f "$pcBackupFile"
    # & openssl enc -aes-256-cbc -salt -pbkdf2 -in "$pcBackupFile" -out "$pcBackupFile.enc" -pass pass:$env:PGPASSWORD

    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRORE] Backup fallito sul PC" -ForegroundColor Red
        exit 1
    }
    else {
        Write-Host "[SUCCESSO] Backup completato sul PC: $pcBackupFile" -ForegroundColor Green
    }

    if ($isUSBConnected) {
        Write-Host "[INFO] Eseguo il dump del database sulla USB in: $usbBackupFile"
        & pg_dump -U $env:PGUSER -d $env:PGDATABASE -h $env:PGHOST -p $env:PGPORT -c -F p -f "$usbBackupFile"

        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ERRORE] Backup fallito su USB" -ForegroundColor Red
        }
        else {
            Write-Host "[SUCCESSO] Backup completato sulla USB: $usbBackupFile" -ForegroundColor Green
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

exit 0