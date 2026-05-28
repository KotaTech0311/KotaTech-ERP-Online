@echo off
chcp 65001 >nul
cd /d %~dp0

echo =====================================
echo KotaTech ERP - Instalar dependencias
echo =====================================

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ERRO: Node.js nao encontrado.
  echo Instale o Node.js LTS: https://nodejs.org
  pause
  exit /b 1
)

echo.
echo Instalando dependencias WEB...
call npm install
if %errorlevel% neq 0 (
  echo ERRO ao instalar dependencias WEB.
  pause
  exit /b 1
)

echo.
echo Instalando dependencias DESKTOP...
cd desktop
call npm install
if %errorlevel% neq 0 (
  echo ERRO ao instalar dependencias DESKTOP.
  pause
  exit /b 1
)

cd ..
echo.
echo Instalacao concluida.
pause
