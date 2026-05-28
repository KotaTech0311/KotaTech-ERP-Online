@echo off
chcp 65001 >nul
cd /d %~dp0\desktop

if not exist icon.ico (
  echo ERRO: icon.ico nao encontrado.
  pause
  exit /b 1
)

if not exist node_modules (
  call npm install
)

echo Gerando EXE portable...
call npm run build
echo.
echo EXE gerado em: desktop\dist
pause
