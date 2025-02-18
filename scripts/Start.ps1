param (
    [string]$Mode
)

$host.UI.RawUI.BackgroundColor = 'Black'
Clear-Host

function Update-Dependencies {
    Write-Host "[INFO] Scarico gli aggiornamenti" -ForegroundColor Magenta
    & git pull

    Write-Host "`n[INFO] Installo le librerie necessarie" -ForegroundColor Magenta
    & npm install
    & npm install prisma@latest
    & npm install @prisma/client@latest

    Write-Host "`n[INFO] Genero il database" -ForegroundColor Magenta
    Push-Location ..
    & npx prisma db push
    & npx prisma generate
    Pop-Location

    Write-Host "`n[INFO] Costruisco il programma" -ForegroundColor Magenta
    & npm run build
}

function Start-Server {
    Write-Host "`n[INFO] Avvio il server locale" -ForegroundColor Magenta
    Start-Process -WindowStyle Minimized -FilePath "cmd.exe" -ArgumentList "/k npm run start"
}

function Wait-For-Server {
    Write-Host "[INFO] Attendo che il server sia pronto" -ForegroundColor Magenta

    $maxAttempts = 5
    $attempts = 0

    do {
        Start-Sleep -Seconds 5
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -ErrorAction SilentlyContinue

        if ($response.StatusCode -eq 200) {
            Write-Host "[SUCCESSO] Il server e' pronto!`n" -ForegroundColor Green
            return
        }

        $attempts++
        Write-Host "[INFO] Tentativo ${attempts}/${maxAttempts}: il server non è ancora pronto, riprovo"
    } while ($attempts -lt $maxAttempts)

    Write-Host "[ERRORE] Il server non è pronto dopo $maxAttempts tentativi. Uscita dal processo." -ForegroundColor Red
    exit 1
}

function Start-App {
    Write-Host "[INFO] Apro l'app desktop" -ForegroundColor Magenta

    Push-Location ..
    Set-Location "dist\win-unpacked"

    if (Test-Path "gestionale-wasabi.exe") {
        Start-Process "gestionale-wasabi.exe"
        Write-Host "[SUCCESSO] Applicazione avviata con successo." -ForegroundColor Green
    } else {
        Write-Host "[ERRORE] File gestionale-wasabi.exe non trovato!" -ForegroundColor Red
    }

    Pop-Location
}

if ($Mode -eq "b") {
    Update-Dependencies
}

Start-Server
Wait-For-Server
Start-App

Write-Host "`n[SUCCESSO] Processo completato." -ForegroundColor Green
exit