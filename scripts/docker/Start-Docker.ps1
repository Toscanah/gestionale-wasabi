param(
    [ValidateSet("menu", "start", "backup", "restore", "worker-start", "worker-backup", "worker-restore")]
    [string]$Action = "menu",
    [string]$TargetDir = "C:\Dockers\Wasabi-Sushi"
)

$ErrorActionPreference = "Stop"

function Invoke-External {
    param(
        [string]$Command,
        [string[]]$Arguments,
        [string]$ErrorMessage
    )

    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw $ErrorMessage
    }
}

function Get-DotEnvValue {
    param(
        [string]$Path,
        [string]$Key
    )

    if (-not (Test-Path $Path)) {
        return $null
    }

    foreach ($line in Get-Content $Path) {
        $trimmed = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($trimmed) -or $trimmed.StartsWith("#")) {
            continue
        }

        $parts = $trimmed -split "=", 2
        if ($parts.Count -ne 2) {
            continue
        }

        if ($parts[0].Trim() -eq $Key) {
            return $parts[1].Trim().Trim('"').Trim("'")
        }
    }

    return $null
}

function Assert-Prerequisites {
    if (-not (Test-Path $TargetDir)) {
        throw "Directory $TargetDir not found"
    }

    Set-Location $TargetDir

    Invoke-External -Command "docker" -Arguments @("ps") -ErrorMessage "Docker is not running or not installed"

    if (-not (Test-Path ".env")) {
        throw ".env file not found - please copy .env.example to .env and configure it"
    }
}

function Test-PortBusy {
    param([int]$Port)

    $result = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    return ($null -ne $result)
}

function Open-WorkerTerminal {
    param(
        [string]$WorkerAction,
        [string]$WindowTitle
    )

    $scriptPath = $PSCommandPath
    if (-not $scriptPath) {
        throw "Cannot resolve current script path"
    }

    $arguments = @(
        "-NoExit",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        "`$Host.UI.RawUI.WindowTitle = '$WindowTitle'; & '$scriptPath' -Action '$WorkerAction' -TargetDir '$TargetDir'"
    )

    Start-Process -FilePath "powershell.exe" -ArgumentList $arguments | Out-Null
}

function Wait-Application {
    Write-Host "> Waiting for services to be ready" -ForegroundColor Gray
    Start-Sleep -Seconds 3

    $maxRetries = 30
    $retryCount = 0
    $appReady = $false

    while ($retryCount -lt $maxRetries -and -not $appReady) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 1 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                $appReady = $true
            }
        }
        catch {
            Start-Sleep -Seconds 1
            $retryCount++
        }
    }

    if (-not $appReady) {
        Write-Host "[WARNING] App not responding yet - continuing anyway" -ForegroundColor Yellow
    }
}

function Invoke-StartWorkflow {
    Assert-Prerequisites

    if (-not (Test-Path "main.js")) {
        throw "main.js not found in deployment directory"
    }

    npm --version > $null 2>&1

    Clear-Host
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Gestionale Wasabi - Start Workflow  " -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""

    Write-Host "> Updating Docker images" -ForegroundColor Cyan
    Invoke-External -Command "docker" -Arguments @("compose", "pull") -ErrorMessage "docker compose pull failed"
    Write-Host ""

    Write-Host "> Cleaning up old containers" -ForegroundColor Cyan
    Invoke-External -Command "docker" -Arguments @("compose", "down", "--remove-orphans") -ErrorMessage "docker compose down failed"
    Write-Host ""

    $envPath = Join-Path $TargetDir ".env"
    $pgAdminPortValue = Get-DotEnvValue -Path $envPath -Key "PGADMIN_PORT"
    $pgAdminPort = 5050
    if ($pgAdminPortValue -and ($pgAdminPortValue -as [int])) {
        $pgAdminPort = [int]$pgAdminPortValue
    }

    $servicesToStart = @("db", "schema-sync", "app")
    if (Test-PortBusy -Port $pgAdminPort) {
        Write-Host "[WARNING] Port $pgAdminPort is already in use. Starting without pgadmin." -ForegroundColor Yellow
    }
    else {
        $servicesToStart += "pgadmin"
    }

    Write-Host "> Starting services ($($servicesToStart -join ', '))" -ForegroundColor Cyan
    Invoke-External -Command "docker" -Arguments @("compose", "up", "-d") + $servicesToStart -ErrorMessage "docker compose up failed"
    Write-Host ""

    Wait-Application

    Write-Host ""
    Write-Host "> Launching Electron desktop app from main.js" -ForegroundColor Cyan
    npx electron main.js

    Write-Host ""
    Write-Host "----------------------------------------" -ForegroundColor Yellow
    Write-Host " [System Cleanup] Electron closed. " -ForegroundColor Yellow
    Write-Host "----------------------------------------" -ForegroundColor Yellow

    Write-Host "> Initiating containerized database backup..." -ForegroundColor Cyan
    & docker compose run --rm backup

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] Backup sequence finished." -ForegroundColor Green
    }
    else {
        Write-Host "[WARNING] Backup failed. Services will still be stopped." -ForegroundColor Yellow
    }

    Write-Host "> Stopping Docker services..." -ForegroundColor Cyan
    Invoke-External -Command "docker" -Arguments @("compose", "down", "--remove-orphans") -ErrorMessage "docker compose down failed"
    Write-Host "  [OK] All containers stopped and removed." -ForegroundColor Green
}

function Invoke-BackupWorkflow {
    Assert-Prerequisites

    Clear-Host
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " Gestionale Wasabi - Manual Backup    " -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""

    Write-Host "> Starting DB container if needed" -ForegroundColor Cyan
    Invoke-External -Command "docker" -Arguments @("compose", "up", "-d", "db") -ErrorMessage "Failed to start db service"

    Write-Host "> Running backup service" -ForegroundColor Cyan
    Invoke-External -Command "docker" -Arguments @("compose", "run", "--rm", "backup") -ErrorMessage "Manual backup failed"

    Write-Host "[OK] Manual backup completed" -ForegroundColor Green
}

function Invoke-RestoreWorkflow {
    Assert-Prerequisites

    $backupPath = Join-Path $TargetDir (Join-Path "backup" "latest.dump")
    if (-not (Test-Path $backupPath)) {
        throw "Backup file not found: $backupPath"
    }

    Clear-Host
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " Gestionale Wasabi - Manual Restore   " -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Selected backup: $backupPath" -ForegroundColor DarkGray
    Write-Host "ATTENTION: restore will overwrite current DB data." -ForegroundColor Yellow

    $confirmation = Read-Host "Type RESTORE to continue"
    if ($confirmation -ne "RESTORE") {
        Write-Host "Restore canceled." -ForegroundColor Yellow
        return
    }

    Write-Host "> Starting DB container if needed" -ForegroundColor Cyan
    Invoke-External -Command "docker" -Arguments @("compose", "up", "-d", "db") -ErrorMessage "Failed to start db service"

    Write-Host "> Running restore service" -ForegroundColor Cyan
    Invoke-External -Command "docker" -Arguments @("compose", "run", "--rm", "restore") -ErrorMessage "Manual restore failed"

    Write-Host "[OK] Manual restore completed" -ForegroundColor Green
}

function Run-Worker {
    param([scriptblock]$Workflow)

    try {
        & $Workflow
        Write-Host ""
        Write-Host "Operation completed." -ForegroundColor Green
    }
    catch {
        Write-Host ""
        Write-Host "[ERROR] Operation failed" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor White
    }
}

switch ($Action) {
    "worker-start" {
        Run-Worker -Workflow ${function:Invoke-StartWorkflow}
        return
    }
    "worker-backup" {
        Run-Worker -Workflow ${function:Invoke-BackupWorkflow}
        return
    }
    "worker-restore" {
        Run-Worker -Workflow ${function:Invoke-RestoreWorkflow}
        return
    }
    "start" {
        Open-WorkerTerminal -WorkerAction "worker-start" -WindowTitle "Wasabi - Start"
        return
    }
    "backup" {
        Open-WorkerTerminal -WorkerAction "worker-backup" -WindowTitle "Wasabi - Backup"
        return
    }
    "restore" {
        Open-WorkerTerminal -WorkerAction "worker-restore" -WindowTitle "Wasabi - Restore"
        return
    }
}

Set-Location $TargetDir

while ($true) {
    Clear-Host
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "   Gestionale Wasabi - Control Menu   " -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1) Start System" -ForegroundColor White
    Write-Host "2) Manual Backup" -ForegroundColor White
    Write-Host "3) Manual Restore" -ForegroundColor White
    Write-Host "4) Exit" -ForegroundColor White
    Write-Host ""

    Write-Host "Select an option [1-4]: " -NoNewline
    $keyInfo = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    $choice = $keyInfo.Character.ToString()
    Write-Host $choice

    switch ($choice) {
        "1" {
            Open-WorkerTerminal -WorkerAction "worker-start" -WindowTitle "Wasabi - Start"
            continue
        }
        "2" {
            Open-WorkerTerminal -WorkerAction "worker-backup" -WindowTitle "Wasabi - Backup"
            continue
        }
        "3" {
            Open-WorkerTerminal -WorkerAction "worker-restore" -WindowTitle "Wasabi - Restore"
            continue
        }
        "4" {
            break
        }
        default {
            Write-Host "Invalid option. Press Enter to continue." -ForegroundColor Yellow
            Start-Sleep -Seconds 1
        }
    }
}
