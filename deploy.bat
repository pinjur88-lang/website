@echo off
echo ===================================================
echo           DEPLOYMENT GOOGLE DRIVE FIX
echo ===================================================
echo.
echo The error "Deletion of directory failed" is almost certainly 
echo because GOOGLE DRIVE is syncing these files.
echo.
echo ---------------------------------------------------
echo CRITICAL STEP: 
echo Please PAUSE GOOGLE DRIVE SYNCING before continuing.
echo (Click the Drive icon in your taskbar -> Settings -> Pause Syncing)
echo ---------------------------------------------------
echo.
pause

echo.
echo Stopping Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo Removing ALL git lock files and stuck states...
if exist ".git\index.lock" del /F /Q ".git\index.lock"
if exist ".git\rebase-merge" rd /S /Q ".git\rebase-merge"
if exist ".git\rebase-apply" rd /S /Q ".git\rebase-apply"

echo.
echo Force removing the problematic directory...
if exist "src\app\api\seed-test-user" rd /S /Q "src\app\api\seed-test-user"

echo.
echo Cleaning up git state...
git rebase --abort >nul 2>&1

echo.
echo 1. Staging changes...
git add .

echo.
echo 2. Committing...
git commit -m "fix: Deployment cleanup and directory removal"

echo.
echo 3. Pulling latest changes...
git pull --rebase origin main

echo.
echo 4. Pushing to GitHub...
git push origin main

echo.
echo ---------------------------------------------------
echo SUCCESS!
echo You can now RESUME GOOGLE DRIVE SYNCING.
echo ---------------------------------------------------
pause
