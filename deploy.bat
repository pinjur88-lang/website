@echo off
echo ===================================================
echo           DEPLOYMENT NUCLEAR SYNC
echo ===================================================
echo.
echo 1. Stopping Node.js...
taskkill /F /IM node.exe >nul 2>&1

echo 2. Clearing Git Locks...
if exist ".git\index.lock" del /F /Q ".git\index.lock"
rd /S /Q ".git\rebase-merge" >nul 2>&1
rd /S /Q ".git\rebase-apply" >nul 2>&1

echo 3. Saving detached work to 'main'...
git branch -f main HEAD
git checkout main

echo 4. Pulling remote changes (Rebase)...
git pull origin main --rebase

echo 5. Pushing to GitHub...
git push origin main

echo.
echo ---------------------------------------------------
echo SUCCESS! Your changes are now live on GitHub.
echo ---------------------------------------------------
pause
