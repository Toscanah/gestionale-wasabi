# ==============================================================================
# Deploy-Docker.ps1
# ==============================================================================
# This script is for DEVELOPERS to build and push Docker images to registry
# Run this when you're ready to push updates to your deployment environment
# ==============================================================================

$ErrorActionPreference = "Stop"

$TargetDir = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
if (-not (Test-Path $TargetDir)) { 
    Write-Host "[!] Directory $TargetDir not found" -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 
}

Set-Location $TargetDir

Clear-Host
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Gestionale Wasabi - Docker Deploy  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker is running
try {
    docker ps > $null 2>&1
    Write-Host "[OK] Docker is running" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Docker is not running or not installed" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again" -ForegroundColor Yellow
    Read-Host "Press Enter to close"
    exit 1
}

Write-Host ""

try {
    # Step 1: Display version info
    Write-Host "> Build Configuration" -ForegroundColor Cyan
    $packageJson = Get-Content package.json | ConvertFrom-Json
    Write-Host "  Version: $($packageJson.version)" -ForegroundColor Gray
    Write-Host "  Image: toscanah/gestionale-wasabi:latest" -ForegroundColor Gray
    Write-Host ""

    # Step 2: Build Docker image
    Write-Host "> Building Docker image" -ForegroundColor Cyan
    docker build -t toscanah/gestionale-wasabi:latest .
    
    if ($LASTEXITCODE -ne 0) {
        throw "Docker build failed"
    }
    
    Write-Host "[OK] Image built successfully" -ForegroundColor Green
    Write-Host ""

    # Step 3: Push to registry
    Write-Host "> Checking Docker authentication" -ForegroundColor Cyan
    
    # Check if user is logged in
    $dockerInfo = docker info 2>&1
    if ($dockerInfo -contains "*ERROR*" -or $dockerInfo -contains "*denied*") {
        Write-Host "[!] Not logged into Docker Hub" -ForegroundColor Yellow
        Write-Host "  Logging in now..." -ForegroundColor Gray
        docker login
        
        if ($LASTEXITCODE -ne 0) {
            throw "Docker login failed"
        }
    }
    
    Write-Host "[OK] Docker authenticated" -ForegroundColor Green
    Write-Host ""

    Write-Host "> Pushing to Docker Hub" -ForegroundColor Cyan
    docker push toscanah/gestionale-wasabi:latest
    
    if ($LASTEXITCODE -ne 0) {
        throw "Docker push failed"
    }
    
    Write-Host "[OK] Image pushed successfully" -ForegroundColor Green

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  [Success] Deployment ready!        " -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps on deployment machine:" -ForegroundColor White
    Write-Host "  1. Copy .env to deployment machine" -ForegroundColor Gray
    Write-Host "  2. Copy docker-compose.yml" -ForegroundColor Gray
    Write-Host "  3. Copy main.js" -ForegroundColor Gray
    Write-Host "  4. Copy scripts\docker\Start-Docker.ps1" -ForegroundColor Gray
    Write-Host "  5. Run: .\Start-Docker.ps1 (menu mode)" -ForegroundColor Gray
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host "[ERROR] Deployment failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to close"
    exit 1
}
