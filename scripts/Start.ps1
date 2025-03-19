param (
    [string]$Mode
)

. "$PSScriptRoot/functions/Get-OS.ps1"

# $host.UI.RawUI.BackgroundColor = 'Black'
# Clear-Host

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

function Test-Server-Running {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -ErrorAction Stop
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

function Start-Server {
    if (Test-Server-Running) {
        Write-Host "[INFO] Il server e' gia' avviato" -ForegroundColor Magenta
        return
    }

    Write-Host "`n[INFO] Avvio il server locale" -ForegroundColor Magenta

    if ($OS -eq "Windows") {
        $serverProcess = Start-Process -WindowStyle Minimized -FilePath "cmd.exe" -ArgumentList "/k npm run start" -PassThru
        $serverProcess.Id | Set-Content "$PSScriptRoot\server.pid"
    }
    else {
        Write-Host "TODO: MacOS later"
    }

    Wait-Server
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
    Write-Host "[INFO] Avvio App Desktop" -ForegroundColor Magenta

    Push-Location ..
    & npm run electron
    Pop-Location
}

if ($Mode -eq "b") {
    Update-Dependencies
}

Start-Server
Start-App

Write-Host "`n[SUCCESSO] Processo completato." -ForegroundColor Green