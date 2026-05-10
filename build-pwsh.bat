@echo off
:: ─────────────────────────────────────────────────────────────────────────────
:: build-pwsh.bat
:: One-time setup: compiles the pwsh.exe Git Bash shim and installs it to PATH
:: so that the GitHub Copilot CLI can run shell commands via Git Bash.
::
:: Run this file ONCE in any terminal (cmd, Git Bash, PowerShell, or by
:: double-clicking). You must have Go installed: https://go.dev/dl/
:: ─────────────────────────────────────────────────────────────────────────────
setlocal enabledelayedexpansion

set "SHIM_SRC=%~dp0pwsh_shim.go"
set "INSTALL_DIR=%USERPROFILE%\AppData\Local\Microsoft\WindowsApps"
set "INSTALL_PATH=%INSTALL_DIR%\pwsh.exe"

echo.
echo  Building pwsh.exe shim (Go required)...
go build -o "%INSTALL_PATH%" "%SHIM_SRC%"

if %ERRORLEVEL% == 0 (
    echo  SUCCESS: pwsh.exe installed to:
    echo    %INSTALL_PATH%
    echo.
    echo  Please RESTART VS Code / the Copilot CLI for changes to take effect.
    goto :end
)

echo  WindowsApps install failed, trying npm global bin...
for /f "tokens=*" %%i in ('npm config get prefix 2^>nul') do set "NPM_PREFIX=%%i"
if defined NPM_PREFIX (
    go build -o "%NPM_PREFIX%\pwsh.exe" "%SHIM_SRC%"
    if !ERRORLEVEL! == 0 (
        echo  SUCCESS: installed to %NPM_PREFIX%\pwsh.exe
        echo  Please restart VS Code.
        goto :end
    )
)

echo.
echo  ERROR: Could not install automatically.
echo  Manual install — run in a terminal with write access to any PATH folder:
echo    go build -o "C:\some\path\in\PATH\pwsh.exe" "%SHIM_SRC%"
echo.

:end
pause
