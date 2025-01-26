@echo off

if "%1"=="build" (
    echo Eseguo il comando "npm run build"...
    call npm run build
)

echo Apro il server locale...
start /min cmd /k "npm run start"

echo Aspetto che il server sia pronto...
:check_server
timeout /t 5 >nul
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo Il server non è ancora pronto, riprovo...
    goto check_server
)
echo Il server è pronto!

echo Apro l'app desktop...
cd dist\win-unpacked
start gestionale-wasabi.exe