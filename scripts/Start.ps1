param (
    [string]$Mode
)

. "$PSScriptRoot/functions/Get-OS.ps1"

$host.UI.RawUI.BackgroundColor = 'Black'
Clear-Host

$OS = Get-OS
Write-Host "[INFO] Rilevato sistema operativo: $OS" -ForegroundColor Magenta

function Update-Dependencies {
    Write-Host "[INFO] Scarico gli aggiornamenti" -ForegroundColor Magenta
    & git pull

    Write-Host "`n[INFO] Installo le librerie necessarie" -ForegroundColor Magenta
    & npm install
    & npm install prisma@latest
    & npm install @prisma/client@latest

    Write-Host "`n[INFO] Imposto il database" -ForegroundColor Magenta
    Push-Location ..
    & npx prisma db push
    & npx prisma generate
    Pop-Location

    Write-Host "`n[INFO] Costruisco il programma" -ForegroundColor Magenta
    & npm run build
}

function Start-Server {
    Write-Host "`n[INFO] Avvio il server locale" -ForegroundColor Magenta

    if ($OS -eq "Windows") {
        Start-Process -WindowStyle Minimized -FilePath "cmd.exe" -ArgumentList "/k npm run start"
    }
    else {
        osascript -e "tell application \"Terminal\" to do script \"cd '$(Get-Location)'; npm run start\""
    }
    # else {
    #     osascript -e 'tell application "Terminal" to do script "cd $(pwd) && npm run start"'
    # }
}

function Wait-Server {
    Write-Host "[INFO] Attendo che il server sia pronto" -ForegroundColor Magenta

    $maxAttempts = 10 
    $attempts = 1

    do {
        Start-Sleep -Seconds 5
        
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "[SUCCESSO] Il server e' pronto!`n" -ForegroundColor Green
                return
            }
        }
        catch {
            Write-Host "[INFO] Tentativo ${attempts}/${maxAttempts}: Il server non e' ancora pronto, riprovo" -ForegroundColor Yellow
        }

        $attempts++
    } while ($attempts -lt $maxAttempts)

    Write-Host "[ERRORE] Il server non e' pronto dopo $maxAttempts tentativi. Uscita dal processo." -ForegroundColor Red
    exit 1
}

function Start-App {
    Write-Host "[INFO] Apro l'app desktop" -ForegroundColor Magenta

    Push-Location ..
    $appPath = Join-Path "dist" "win-unpacked"
    Set-Location $appPath

    if (Test-Path "gestionale-wasabi.exe") {
        Start-Process "gestionale-wasabi.exe"
        Write-Host "[SUCCESSO] Applicazione avviata con successo" -ForegroundColor Green
    }
    else {
        Write-Host "[ERRORE] File gestionale-wasabi.exe non trovato" -ForegroundColor Red
    }

    Pop-Location
}

if ($Mode -eq "b") {
    Update-Dependencies
}

Start-Server
Wait-Server
Start-App

Write-Host "`n[SUCCESSO] Processo completato." -ForegroundColor Green