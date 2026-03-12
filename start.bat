@echo off
echo ========================================
echo  Starting Predict Genie
echo ========================================

echo.
echo [1/3] Checking Python dependencies...
cd backend
pip install -q fastapi uvicorn sqlalchemy pandas scikit-learn numpy python-dotenv pydantic python-multipart 2>nul

echo.
echo [2/3] Starting Backend Server (Port 8000)...
start "Predict Genie Backend" cmd /k "python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

echo.
echo [3/3] Starting Frontend Server (Port 3000)...
cd ..\frontend
start "Predict Genie Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo  Waiting for servers to start...
echo ========================================
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo  Predict Genie is Ready!
echo ========================================
echo.
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:8000
echo  API Docs: http://localhost:8000/docs
echo.
echo  Opening browser in 3 seconds...
echo ========================================
timeout /t 3 /nobreak >nul

start http://localhost:3000

echo.
echo Press any key to close this window...
pause >nul
