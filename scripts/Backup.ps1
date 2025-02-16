function Initialize-Environment {
    Write-Host "[INFO] Configurazione dell'ambiente..." -ForegroundColor Gray
    $envPath = (Get-Item $PSScriptRoot).Parent.FullName + "\.env"

    if (Test-Path $envPath) {
        Get-Content $envPath | ForEach-Object {
            if ($_ -match "^PGPASSWORD=(.*)") {
                $env:PGPASSWORD = $matches[1]
            }
        }
        
        Write-Host "[INFO] Password caricata da .env." -ForegroundColor Gray
    } else {
        Write-Host "[ERRORE] Nessun file .env trovato" -ForegroundColor Red
        exit 1
    }
}

function New-Backup-Folder {
    Write-Host "[INFO] Verifica della cartella di backup..." -ForegroundColor Gray
    $global:BACKUP_FOLDER = (Get-Item $PSScriptRoot).Parent.FullName + "\backup"

    if (!(Test-Path $BACKUP_FOLDER)) {
        Write-Host "[INFO] Creazione della cartella di backup..." -ForegroundColor Gray
        New-Item -ItemType Directory -Path $BACKUP_FOLDER | Out-Null
        Write-Host "[SUCCESSO] Cartella di backup creata: $BACKUP_FOLDER" -ForegroundColor Green
    } else {
        Write-Host "[INFO] La cartella di backup esiste gia': $BACKUP_FOLDER" -ForegroundColor Gray
    }
}

function Backup-Database {
    Write-Host "[INFO] Avvio del backup del database..." -ForegroundColor Gray
    $tables = & psql -U $env:PGUSER -d $env:PGDATABASE -h $env:PGHOST -p $env:PGPORT -t -c "SELECT tablename FROM pg_tables WHERE schemaname='public';"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRORE] Impossibile ottenere la lista delle tabelle!" -ForegroundColor Red
        exit 1
    }

    $tables -split "`n" | ForEach-Object {
        $tableName = $_.Trim()

        if ($tableName -ne "") {
            Write-Host "[INFO] Eseguo il backup della tabella: $tableName..." -ForegroundColor Gray
            $quotedTable = "\`"$tableName\`""
            $backupFile = "$BACKUP_FOLDER\$tableName.sql"

            & pg_dump -U $env:PGUSER -d $env:PGDATABASE -h $env:PGHOST -p $env:PGPORT -t $quotedTable --data-only --column-inserts -f $backupFile

            if ($LASTEXITCODE -ne 0) {
                Write-Host "[ERRORE] Backup fallito per la tabella: $tableName" -ForegroundColor Red
                Add-Content -Path "$BACKUP_FOLDER\export_errors.log" -Value "[ERRORE] Backup fallito per la tabella: $tableName"
            } else {
                Write-Host "[SUCCESSO] Backup completato per la tabella: $tableName" -ForegroundColor Green
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

Write-Host "[SUCCESSO] Backup completato con successo in $BACKUP_FOLDER!" -ForegroundColor Green