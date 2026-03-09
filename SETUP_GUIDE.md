# 🚀 Setup Guide for Team Members

## Quick Start (For Windows)

### Option 1: Use the Startup Script (Easiest)
1. **Double-click** `start.bat` in the project root folder
2. Wait for both servers to start (about 10 seconds)
3. Browser will open automatically to `http://localhost:3000`

### Option 2: Manual Start
Open **TWO separate** PowerShell/Command Prompt windows:

**Terminal 1 - Backend:**
```bash
cd "AI Marketing Intelligence Predict Genie\backend"
pip install fastapi uvicorn sqlalchemy pandas scikit-learn numpy python-dotenv pydantic python-multipart
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd "AI Marketing Intelligence Predict Genie\frontend"
npm install
npm run dev
```

Then open: http://localhost:3000

---

## Quick Start (For Mac/Linux)

### Option 1: Use the Startup Script
```bash
cd "AI Marketing Intelligence Predict Genie"
chmod +x start.sh
./start.sh
```

### Option 2: Manual Start
Open **TWO separate** terminal windows and follow the same commands as Windows Option 2.

---

## ⚠️ Troubleshooting

### Upload Failing / "Failed to upload file"
**Problem:** Backend is not running

**Solution:**
1. Check if backend is running: Open http://localhost:8000 in browser
2. You should see: `{"message":"Welcome to Predict Genie API"...}`
3. If not, restart backend server (see Terminal 1 above)

### Frontend Not Loading
**Problem:** Node modules not installed

**Solution:**
```bash
cd frontend
npm install
npm run dev
```

### Port Already in Use
**Problem:** Port 8000 or 3000 is occupied

**Solution:**
```bash
# Windows: Find and kill process
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux: Find and kill process
lsof -ti:8000 | xargs kill -9
```

### Python Packages Not Found
**Problem:** Missing dependencies

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

---

## 📋 Prerequisites

Before running, ensure you have:
- ✅ **Python 3.11+** installed
- ✅ **Node.js 18+** installed
- ✅ **pip** (Python package manager)
- ✅ **npm** (Node package manager)

Check versions:
```bash
python --version
node --version
npm --version
```

---

## 🎯 First Time Setup Checklist

- [ ] Clone the repository
- [ ] Install Python dependencies (backend)
- [ ] Install Node dependencies (frontend)
- [ ] Start both servers
- [ ] Open http://localhost:3000
- [ ] Upload sample_data.csv to test

---

## 🔗 Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main dashboard |
| Backend API | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/docs | Interactive API documentation |
| Health Check | http://localhost:8000/health | Backend status |

---

## 📝 Need Help?

1. Make sure **BOTH** backend and frontend are running
2. Check the terminal output for errors
3. Verify URLs are accessible in browser
4. Try the sample_data.csv file first

**Backend should show:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
✅ Database initialized successfully
```

**Frontend should show:**
```
✓ Ready in 2.3s
○ Local:   http://localhost:3000
```
