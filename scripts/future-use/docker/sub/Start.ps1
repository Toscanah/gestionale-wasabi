param(
    [string]$TargetDir = "C:\Dockers\Wasabi-Sushi"
)

$scriptRoot = Resolve-Path (Join-Path $PSScriptRoot "..\Start-Docker.ps1").Path
& $scriptRoot -Action start -TargetDir $TargetDir
