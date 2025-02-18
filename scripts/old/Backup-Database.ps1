. "$PSScriptRoot\functions\Initialize-Environment.ps1"
. "$PSScriptRoot\functions\Invoke-Each-Table.ps1"

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

    Invoke-Each-Table {
        param ($tableName)

        Write-Host "Eseguo il backup sul PC per la tabella `"$tableName`""
        $quotedTable = "\`"$tableName\`""
        $backupFile = "$BACKUP_FOLDER\$tableName.sql"

        & pg_dump -U $env:PGUSER -d $env:PGDATABASE -h $env:PGHOST -p $env:PGPORT -t $quotedTable --data-only --column-inserts -f "$backupFile"

        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ERRORE] Backup fallito sul PC per la tabella `"$tableName`"" -ForegroundColor Red
            Add-Content -Path "$BACKUP_FOLDER\export_errors.log" -Value "[ERRORE] Backup fallito per la tabella: `"$tableName`" `n"
        }
        else {
            Write-Host "[SUCCESSO] Backup completato sul PC per la tabella `"$tableName`"" -ForegroundColor Green
            if (!$isUSBConnected) { Write-Host "" }
        } 

        if ($isUSBConnected) {
            $usbBackupFile = "$global:USB_BACKUP_FOLDER\$tableName.sql"
            Write-Host "Eseguo il backup su USB per la tabella `"$tableName`""

            & pg_dump -U $env:PGUSER -d $env:PGDATABASE -h $env:PGHOST -p $env:PGPORT -t $quotedTable --data-only --column-inserts -f "$usbBackupFile"

            if ($LASTEXITCODE -ne 0) {
                Write-Host "[ERRORE] Backup fallito su USB per la tabella `"$tableName`"" -ForegroundColor Red
                Add-Content -Path "$global:USB_BACKUP_FOLDER\export_errors.log" -Value "[ERRORE] Backup fallito per la tabella: `"$tableName`" `n"
            }
            else {
                Write-Host "[SUCCESSO] Backup su USB completato per la tabella `"$tableName`" `n" -ForegroundColor Green
            }
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

Write-Host "[SUCCESSO] Backup completato con successo in $BACKUP_FOLDER" -ForegroundColor Green