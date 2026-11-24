#!/usr/bin/env bash

# Auto-port detection for Laravel + Vite dev servers

set -e

# Function to find an available port starting from a given port
find_available_port() {
    local start_port=$1
    local port=$start_port
    
    while lsof -i :$port >/dev/null 2>&1; do
        echo "Port $port is in use, trying next..." >&2
        port=$((port + 1))
    done
    
    echo $port
}

# Find available ports
LARAVEL_PORT=$(find_available_port 8000)
VITE_PORT=$(find_available_port 5173)

echo "Starting Laravel on port $LARAVEL_PORT"
echo "Starting Vite on port $VITE_PORT"

# Update .env with detected ports
sed -i "s/^APP_URL=.*/APP_URL=http:\/\/127.0.0.1:$LARAVEL_PORT/" .env
sed -i "s/^VITE_APP_URL=.*/VITE_APP_URL=http:\/\/127.0.0.1:$LARAVEL_PORT/" .env

# Export for Vite
export PORT=$VITE_PORT

# Start Laravel in background
php artisan serve --host=127.0.0.1 --port=$LARAVEL_PORT --no-reload &
LARAVEL_PID=$!

# Give Laravel a moment to start
sleep 2

# Start Vite in background
npm run dev -- --port $VITE_PORT --host 127.0.0.1 &
VITE_PID=$!

# Trap signals to clean up
trap "kill $LARAVEL_PID $VITE_PID 2>/dev/null; exit" INT TERM EXIT

echo ""
echo "====================================="
echo "Servers running:"
echo "  Laravel: http://127.0.0.1:$LARAVEL_PORT"
echo "  Vite:    http://127.0.0.1:$VITE_PORT"
echo "====================================="
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $LARAVEL_PID $VITE_PID