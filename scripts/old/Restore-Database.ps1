. "$PSScriptRoot\functions\Initialize-Environment.ps1"
. "$PSScriptRoot\functions\Invoke-Each-Table.ps1"

function Disable-Foreign-Keys {
    Write-Host "[INFO] Disabilitazione vincoli di chiave esterna" -ForegroundColor Magenta

    Invoke-Each-Table {
        param ($tableName)

        Write-Host "Disabilitazione trigger per la tabella `"$tableName`""
        $quotedTable = "\`"$tableName\`""
        $disableFKSQL = "ALTER TABLE $quotedTable DISABLE TRIGGER ALL;"

        & psql -U $env:PGUSER -d $env:PGDATABASE -h $env:PGHOST -p $env:PGPORT -c "$disableFKSQL" --quiet > $null 2>&1

        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ERRORE] Disabilitazione trigger fallita per la tabella `"$tableName`" `n" -ForegroundColor Red
        }
        else {
            Write-Host "[SUCCESSO] Trigger disabilitati per la tabella `"$tableName`" `n" -ForegroundColor Green
        }
    }
}

function Enable-Foreign-Keys {
    Write-Host "[INFO] Riabilitazione vincoli di chiave esterna" -ForegroundColor Magenta

    Invoke-Each-Table {
        param ($tableName)

        Write-Host "Riabilitazione trigger per la tabella `"$tableName`""
        $quotedTable = "\`"$tableName\`""
        $enableFKSQL = "ALTER TABLE $quotedTable ENABLE TRIGGER ALL;"


        & psql -U $env:PGUSER -d $env:PGDATABASE -h $env:PGHOST -p $env:PGPORT -c "$enableFKSQL" --quiet > $null 2>&1

        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ERRORE] Riabilitazione trigger fallita per la tabella `"$tableName`" `n" -ForegroundColor Red
        }
        else {
            Write-Host "[SUCCESSO] Trigger riabilitati per la tabella `"$tableName`" `n" -ForegroundColor Green
        }
    }
}

function Restore-Database {
    Write-Host "[INFO] Avvio del ripristino del database" -ForegroundColor Magenta

    Disable-Foreign-Keys

    Write-Host "[INFO] Avvio pulizia delle tabelle" -ForegroundColor Magenta

    Invoke-Each-Table {
        param ($tableName)

        Write-Host "Pulizia della tabella `"$tableName`""
        $quotedTable = "\`"$tableName\`""
        $sqlFile = "$RESTORE_FOLDER\$tableName.sql"

        if (!(Test-Path $sqlFile)) {
            Write-Host "[ERRORE] Nessun file di backup trovato per `"$tableName`". Ripristino impossibile" -ForegroundColor Red
            return
        }
        
        $truncateSQL = "TRUNCATE TABLE $quotedTable CASCADE;"
        & psql -U $env:PGUSER -d $env:PGDATABASE -h $env:PGHOST -p $env:PGPORT -c "$truncateSQL" --quiet > $null 2>&1

        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ERRORE] Pulizia fallita per la tabella `"$tableName`"" -ForegroundColor Red
        }
        else {
            Write-Host "[SUCCESSO] Pulizia eseguita per la tabella `"$tableName`"" -ForegroundColor Green
        }

        Write-Host "Importazione dati nella tabella: $tableName"

        if ($tableName -eq "Product") {
            & psql -U $env:PGUSER -d $env:PGDATABASE -h $env:PGHOST -p $env:PGPORT -f $sqlFile
        } else {

            & psql -U $env:PGUSER -d $env:PGDATABASE -h $env:PGHOST -p $env:PGPORT -f $sqlFile --quiet > $null 2>&1
        }

        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ERRORE] Importazione fallita per la tabella `"$tableName`" `n" -ForegroundColor Red
        }
        else {
            Write-Host "[SUCCESSO] Dati importati per la tabella `"$tableName`" `n" -ForegroundColor Green
        }
    }

    Enable-Foreign-Keys
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