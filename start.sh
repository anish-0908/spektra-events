#!/bin/bash

echo "========================================"
echo "  Starting Spektra Event Booking Platform"
echo "========================================"
echo ""

echo "[1/3] Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "ERROR: MongoDB is not installed or not in PATH"
    echo "Please install MongoDB and try again"
    exit 1
fi
echo "MongoDB found!"
echo ""

echo "[2/3] Starting Backend Server..."
cd server
npm start &
BACKEND_PID=$!
cd ..
sleep 3
echo ""

echo "[3/3] Starting Frontend..."
npm run dev &
FRONTEND_PID=$!
echo ""

echo "========================================"
echo "  Spektra is running!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
