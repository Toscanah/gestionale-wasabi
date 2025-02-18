function Initialize-Environment {
    Write-Host "[INFO] Configurazione dell'ambiente" -ForegroundColor Magenta
    $envPath = (Get-Item $PSScriptRoot).Parent.Parent.FullName + "\.env"

    if (Test-Path $envPath) {
        $passwordFound = $false
        $envLines = Get-Content $envPath

        foreach ($line in $envLines) {
            if ($line -match "^\s*PGPASSWORD\s*=\s*(.+)") {
                $env:PGPASSWORD = $matches[1].Trim()
                $passwordFound = $true
                break
            }
        }

        if ($passwordFound) {
            Write-Host "[SUCCESSO] Password caricata da .env`n" -ForegroundColor Green
        }
        else {
            Write-Host "[ERRORE] Nessuna password trovata nel file .env`n" -ForegroundColor Red
            exit 1
        }
    }
    else {
        Write-Host "[ERRORE] Nessun file .env trovato`n" -ForegroundColor Red
        exit 1
    }
}