@echo off
REM Enable command echoing (optional for debugging)
setlocal enabledelayedexpansion

call git pull

REM Install dependencies
echo Installing dependencies...
call npm install
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies.
    exit /b %ERRORLEVEL%
)

REM Generate Prisma client
echo Generating Prisma client...
call npx prisma generate
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to generate Prisma client.
    exit /b %ERRORLEVEL%
)

REM Build the project
echo Building the project...
call npm run build
IF %ERRORLEVEL% NEQ 0 (
    echo Build failed.
    exit /b %ERRORLEVEL%
)

REM Start the project
echo Starting the project...
call npm start

REM Open in browser
echo Opening in browser...
call explorer "http://localhost:3000"
