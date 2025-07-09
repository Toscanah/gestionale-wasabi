param (
    [string]$h = ""
)

function Initialize-API {
    Write-Host "[INFO] OpenAI API key configuration" -ForegroundColor Magenta
    $envPath = Join-Path (Get-Item $PSScriptRoot).Parent.FullName "gestionale-wasabi\.env"
    Write-Host "Looking for .env at: $envPath"

    if (Test-Path $envPath) {
        $keyFound = $false
        $envLines = Get-Content $envPath

        foreach ($line in $envLines) {
            if ($line -match "^\s*OPENAI_API\s*=\s*(.+)") {
                $env:API_KEY = $matches[1].Trim()
                $keyFound = $true
                break
            }
        }

        if ($keyFound) {
            Write-Host "[SUCCESS] API key loaded from .env`n" -ForegroundColor Green
        }
        else {
            Write-Host "[ERROR] No API key was found in .env`n" -ForegroundColor Red
            exit 1
        }
    }
    else {
        Write-Host "[ERROR] No .env found`n" -ForegroundColor Red
        exit 1
    }
}

Initialize-API

Write-Host "[INFO] Adding all changed files to Git" -ForegroundColor Magenta
git add .

$diff = git diff --cached

if ([string]::IsNullOrEmpty($diff)) {
    Write-Host "[INFO] No staged changes. Exiting" -ForegroundColor Magenta
    exit
}

$systemPrompt = "Generate a concise and meaningful Git commit message from the provided code diff. Keep it under 15 words."

if ($h) {
    $systemPrompt += " Hint: $h"
}

$body = @{
    "model"       = "gpt-4o-mini"
    "messages"    = @(
        @{ "role" = "system"; "content" = $systemPrompt },
        @{ "role" = "user"; "content" = ($diff -join "`n") }
    )
    "temperature" = 0.2
}


$bodyJson = $body | ConvertTo-Json -Depth 10 -Compress
$bodyJson = [System.Text.Encoding]::UTF8.GetBytes($bodyJson)

$response = Invoke-RestMethod -Uri "https://api.openai.com/v1/chat/completions" `
    -Method Post `
    -Headers @{ "Authorization" = "Bearer $env:API_KEY"; "Content-Type" = "application/json" } `
    -Body $bodyJson

if ($response -and $response.choices) {
    $commitMessage = $response.choices[0].message.content
    Write-Host "[SUCCESS] Generated commit message: $commitMessage" -ForegroundColor Green
    
    git commit -m "$commitMessage"

    Write-Host "[INFO] Pushing to remote repository" -ForegroundColor Magenta
    git push
    Write-Host "[SUCCESS] Commit pushed to remote repository" -ForegroundColor Green
}
else {
    Write-Host "[ERROR] No response from OpenAI API" -ForegroundColor Red
}