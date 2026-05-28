@echo off
chcp 65001 >nul
cd /d %~dp0\desktop

if not exist node_modules (
  call npm install
)

echo Abrindo KotaTech ERP Desktop...
call npm run start
pause
