@echo off
chcp 65001 >nul
cd /d %~dp0

if not exist node_modules (
  call npm install
)

if not exist .env.local (
  echo ATENCAO: crie o arquivo .env.local com as chaves do Supabase.
  echo Veja o arquivo .env.example
  pause
)

echo Abrindo Web local em http://localhost:3000
call npm run dev
pause
