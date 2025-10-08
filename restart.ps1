# Islamic Finance Workflows - Service Restart Script
# Kills all frontend/backend processes and clears caches

Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow

# Kill all Node.js processes (frontend)
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "✓ Killed Node.js processes (frontend)" -ForegroundColor Green
} else {
    Write-Host "○ No Node.js processes running" -ForegroundColor Gray
}

# Kill all Python processes (backend)
$pythonProcesses = Get-Process python -ErrorAction SilentlyContinue
if ($pythonProcesses) {
    $pythonProcesses | Stop-Process -Force
    Write-Host "✓ Killed Python processes (backend)" -ForegroundColor Green
} else {
    Write-Host "○ No Python processes running" -ForegroundColor Gray
}

# Clear Next.js cache
Write-Host ""
Write-Host "🧹 Clearing caches..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✓ Cleared Next.js cache (.next)" -ForegroundColor Green
}

# Clear Python cache
$pycacheItems = Get-ChildItem -Recurse -Include __pycache__ -ErrorAction SilentlyContinue
if ($pycacheItems) {
    $pycacheItems | Remove-Item -Recurse -Force
    Write-Host "✓ Cleared Python caches (__pycache__)" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ All services stopped and caches cleared!" -ForegroundColor Green
Write-Host ""
Write-Host "To restart services:" -ForegroundColor Cyan
Write-Host "  Frontend: npm run dev" -ForegroundColor White
Write-Host "  Backend:  cd backend && python -m uvicorn app.main:app --reload --port 8000" -ForegroundColor White
Write-Host ""
