@echo off
setlocal
cd /d "%~dp0"

echo ============================================
echo   Presentacion PIML - apertura local
echo ============================================
echo.

if not exist node_modules (
    echo Primera vez: instalando dependencias, espera...
    call npm install --silent
    echo.
)

echo Compilando la presentacion...
call npm run build --silent
if errorlevel 1 (
    echo ERROR: fallo la compilacion. Revisa la salida de npm.
    pause
    exit /b 1
)

rem Servidor local en segundo plano (ventana minimizada "PIML preview")
start "PIML preview" /min cmd /c "npm run preview --silent"
timeout /t 2 /nobreak >nul

start "" "http://localhost:4173/presentacion-piml/"

echo.
echo   La presentacion esta abierta en:
echo   http://localhost:4173/presentacion-piml/
echo.
echo   Para cerrarla: cierra esta ventana y la ventana
echo   minimizada "PIML preview" de la barra de tareas.
echo.
pause
