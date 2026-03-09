#!/bin/bash

echo "========================================"
echo " Starting Predict Genie"
echo "========================================"
echo ""

echo "[1/3] Installing Python dependencies..."
cd backend
pip install -q fastapi uvicorn sqlalchemy pandas scikit-learn numpy python-dotenv pydantic python-multipart

echo ""
echo "[2/3] Starting Backend Server (Port 8000)..."
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

echo ""
echo "[3/3] Starting Frontend Server (Port 3000)..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo " Waiting for servers to start..."
echo "========================================"
sleep 10

echo ""
echo "========================================"
echo " Predict Genie is Ready!"
echo "========================================"
echo ""
echo " Frontend: http://localhost:3000"
echo " Backend:  http://localhost:8000"
echo " API Docs: http://localhost:8000/docs"
echo ""
echo "========================================"

# Open browser (works on macOS and Linux)
if command -v open &> /dev/null; then
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
fi

echo ""
echo "Press Ctrl+C to stop all servers"
wait
