@echo off
setlocal

:: Check if the first parameter is "build"
if "%1"=="-b" (
  call :update_dependencies
)

call :start_server
call :wait_for_server
call :launch_app

exit /b

:: --------------------------------------------
:: FUNCTION: Update dependencies and build project
:: --------------------------------------------
:update_dependencies
echo [INFO] Scarico gli aggiornamenti...
call git pull

echo [INFO] Installo le librerie necessarie...
call npm install

echo [INFO] Genero il database...
pushd ..
call npx prisma db push
call npx prisma generate
popd

echo [INFO] Costruisco il programma...
call npm run build

exit /b

:: --------------------------------------------
:: FUNCTION: Start the local server
:: --------------------------------------------
:start_server
echo [INFO] Avvio il server locale...
start /min cmd /k "npm run start"
exit /b

:: --------------------------------------------
:: FUNCTION: Wait for server to be ready
:: --------------------------------------------
:wait_for_server
echo [INFO] Attendo che il server sia pronto...

:check_server
timeout /t 5 >nul
curl -s http://localhost:3000 >nul 2>&1

if %errorlevel% neq 0 (
  echo [INFO] Il server non è ancora pronto, riprovo...
  goto check_server
)

echo [SUCCESSO] Il server è pronto!
exit /b

:: --------------------------------------------
:: FUNCTION: Launch the desktop application
:: --------------------------------------------
:launch_app
echo [INFO] Apro l'app desktop...
pushd ..
cd dist\win-unpacked

if exist gestionale-wasabi.exe (
  start gestionale-wasabi.exe
  echo [SUCCESS]O Applicazione avviata con successo.
  ) else (
  echo [ERRORE] File gestionale-wasabi.exe non trovato!
)

popd
exit /b
