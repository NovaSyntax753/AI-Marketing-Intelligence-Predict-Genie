# 🚀 Quick Start Guide - Predict Genie

Get up and running in 5 minutes!

## Prerequisites
- Docker Desktop installed and running
- Or: Node.js 18+, Python 3.11+, PostgreSQL 15+

## Quick Start with Docker (Easiest)

1. **Open terminal in project directory**
   ```bash
   cd "AI Marketing Intelligence Predict Genie"
   ```

2. **Start everything**
   ```bash
   docker-compose up --build
   ```
   
   Wait for all services to start (2-3 minutes first time)

3. **Open your browser**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs

4. **Upload sample data**
   - Go to Upload page
   - Select `sample_data.csv`
   - Click "Upload Dataset"

5. **Explore!**
   - View Analytics
   - Train Model & Predict
   - Get Recommendations

## Quick Start without Docker

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your PostgreSQL credentials
python main.py
```

### Frontend (new terminal)
```bash
cd frontend
npm install
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
npm run dev
```

Visit http://localhost:3000

## First Steps

1. **Upload Data** → Use sample_data.csv or your own
2. **View Analytics** → See insights and charts
3. **Train Model** → Click "Train Model" on Predict page
4. **Make Predictions** → Predict engagement for new posts
5. **Get Recommendations** → AI-powered marketing tips

## Troubleshooting

**Port already in use?**
```bash
docker-compose down
# Change ports in docker-compose.yml
```

**Database error?**
```bash
docker-compose down -v
docker-compose up --build
```

**Need help?** Check README.md for detailed documentation

## What's Next?

- Upload your own marketing data
- Train the model with more data
- Experiment with predictions
- Apply AI recommendations to your strategy

---

**Enjoy using Predict Genie! 🔮✨**
