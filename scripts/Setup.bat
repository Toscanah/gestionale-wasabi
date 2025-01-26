@echo off

:: Step 1: Update the repository
echo Pulling latest code from the repository...
call git pull

:: Step 2: Install dependencies
echo Installing dependencies...
call npm install

:: Step 3: Generate Prisma files
echo Generating Prisma files...
call npx prisma generate

:: Step 4: Build the project and create the .exe file
echo Building the project and creating executable...
call npm run build

:: Step 5: Start the server in a new terminal
echo Starting the local server...
start cmd /k "npm run start"

:: Step 6: Wait for the server to be ready
echo Waiting for the server to be ready...
:check_server
timeout /t 5 >nul
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo Server is not ready yet. Retrying...
    goto check_server
)
echo Server is ready!

:: Step 7: Open the Electron desktop app
echo Starting the Electron desktop app...
cd dist\win-unpacked
start gestionale-wasabi.exe

@REM npx electron .