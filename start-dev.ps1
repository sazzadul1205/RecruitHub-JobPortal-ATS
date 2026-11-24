# Auto-port detection for Laravel + Vite dev servers (Windows PowerShell)

# Function to find an available port
function Find-AvailablePort {
    param([int]$StartPort)
    $port = $StartPort
    while (Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet) {
        Write-Host "Port $port is in use, trying next..." -ForegroundColor Yellow
        $port++
    }
    return $port
}

# Find available ports
$laravelPort = Find-AvailablePort 8000
$vitePort = Find-AvailablePort 5173

Write-Host "Starting Laravel on port $laravelPort" -ForegroundColor Green
Write-Host "Starting Vite on port $vitePort" -ForegroundColor Green

# Update .env with detected ports
$envContent = Get-Content .env -Raw
$envContent = $envContent -replace '^APP_URL=.*', "APP_URL=http://127.0.0.1:$laravelPort"
$envContent = $envContent -replace '^VITE_APP_URL=.*', "VITE_APP_URL=http://127.0.0.1:$laravelPort"
$envContent | Set-Content .env

# Export for Vite
$env:PORT = $vitePort

# Start Laravel in background using cmd
$laravelProcess = Start-Process cmd -ArgumentList "/c php artisan serve --host=127.0.0.1 --port=$laravelPort --no-reload" -PassThru -WindowStyle Hidden

# Give Laravel a moment to start
Start-Sleep 2

# Start Vite in background using cmd
$viteProcess = Start-Process cmd -ArgumentList "/c npm run dev -- --port $vitePort --host 127.0.0.1" -PassThru -WindowStyle Hidden

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Servers running:" -ForegroundColor Cyan
Write-Host "  Laravel: http://127.0.0.1:$laravelPort" -ForegroundColor Cyan
Write-Host "  Vite:    http://127.0.0.1:$vitePort" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow

# Wait for both processes
try {
    $laravelProcess.WaitForExit()
    $viteProcess.WaitForExit()
} finally {
    Stop-Process -Id $laravelProcess.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $viteProcess.Id -Force -ErrorAction SilentlyContinue
}