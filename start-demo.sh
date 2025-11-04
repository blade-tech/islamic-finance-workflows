#!/bin/bash

echo "Starting Islamic Finance Workflows Demo..."
echo ""
echo "[1/3] Starting Backend API on port 8000..."
cd backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

echo "[2/3] Starting Frontend Dev Server on port 3040..."
npm run dev &
FRONTEND_PID=$!

sleep 5

echo "[3/3] Opening browser..."
if command -v xdg-open > /dev/null; then
  xdg-open http://localhost:3040  # Linux
elif command -v open > /dev/null; then
  open http://localhost:3040  # Mac
fi

echo ""
echo "========================================"
echo "  Islamic Finance Workflows Demo"
echo "========================================"
echo "  Frontend: http://localhost:3040"
echo "  Backend:  http://localhost:8000"
echo "  Health:   http://localhost:8000/health"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Wait for user interrupt
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
