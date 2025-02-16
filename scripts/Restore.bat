@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

:: -------------------------------
:: CONFIGURAZIONE
:: -------------------------------
set PGUSER=postgres
set PGDATABASE=gestionale-wasabi
set PGHOST=localhost
set PGPORT=5432
set PGPASSWORD=

set "RESTORE_FOLDER=%CD%\..\backup"

:: Verifica se la cartella esiste
if not exist "%RESTORE_FOLDER%" (
  echo [ERRORE] La cartella specificata non esiste. Assicurati di inserire un percorso valido.
  exit /b
)

call :setup_environment
call :restore_database

echo [SUCCESSO] Il ripristino dei dati è stato completato!
ENDLOCAL
exit /b

:: -------------------------------
:: FUNZIONE: Configura l'ambiente
:: -------------------------------
:setup_environment
echo [INFO] Configurazione dell'ambiente...

:: Carica la password dal file .env, se esiste
cd ..
if exist ".env" (
  for /f "tokens=1,2 delims==" %%a in ('type .env') do (
    if "%%a"=="PGPASSWORD" set "PGPASSWORD=%%b"
  )
  echo [INFO] Password caricata da .env.
  ) else (
  echo [ATTENZIONE] Nessun file .env trovato. Verrà utilizzata l'autenticazione di sistema.
)

cd "%~dp0"
exit /b

:: -------------------------------
:: FUNZIONE: Ripristina il database
:: -------------------------------
:restore_database
echo [INFO] Avvio del ripristino del database...

REM TODO: problema che quando restoro i file e c'è ne stanno altri, da errore per l'id duplicato
REM 2 soluzioni: pulisco le tabelle prima e poi restoro, oppure qualche commando/flag che skippa i duplicati quando restoro

:: Loop attraverso tutti i file .SQL nella cartella specificata
for %%f in ("%RESTORE_FOLDER%\*.sql") do (
  set "SQL_FILE=%%f"
  set "TABLE_NAME=%%~nf"  REM Ottieni il nome del file senza estensione
  
  if not "!TABLE_NAME!"=="" (
    echo [INFO] Importazione dati nella tabella: !TABLE_NAME!...
    psql -U %PGUSER% -d %PGDATABASE% -h %PGHOST% -p %PGPORT% -f "!SQL_FILE!"
    
    :: Log degli errori
    if %ERRORLEVEL% NEQ 0 (
      echo [ERRORE] Importazione fallita per la tabella: !TABLE_NAME! >> "%RESTORE_FOLDER%\import_errors.log"
      ) else (
      echo [SUCCESSO] Dati importati con successo nella tabella: !TABLE_NAME!
    )
  )
)

exit /b
