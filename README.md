# 🔮 Predict Genie - AI Marketing Intelligence Platform

A production-ready AI-powered marketing analytics and prediction platform built with modern technologies.

![Tech Stack](https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![Database](https://img.shields.io/badge/Database-PostgreSQL-316192?style=for-the-badge&logo=postgresql)
![ML](https://img.shields.io/badge/ML-scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn)

## 🚀 Features

### MODULE 1 — Data Ingestion
- ✅ Upload CSV marketing/social media datasets
- ✅ Support for multiple platforms (Instagram, Facebook, Twitter, LinkedIn, TikTok, YouTube)
- ✅ Data validation layer
- ✅ PostgreSQL storage with engagement rate calculation

### MODULE 2 — Analytics Engine
- ✅ Engagement rate calculation
- ✅ Performance grouping by platform, content type, and posting time
- ✅ Top-performing content detection
- ✅ Interactive charts and visualizations

### MODULE 3 — Prediction Engine
- ✅ Random Forest regression model
- ✅ Predict engagement based on post_type, posting_time, and platform
- ✅ Model training with historical data
- ✅ Confidence scoring

### MODULE 4 — AI Recommendation Engine
- ✅ Best posting time recommendations
- ✅ Optimal content type suggestions
- ✅ Platform performance insights
- ✅ Caption improvement tips
- ✅ Actionable marketing strategies

### MODULE 5 — Dashboard UI
- ✅ Modern, clean interface with Tailwind CSS
- ✅ Upload dataset page
- ✅ Interactive analytics charts (Recharts)
- ✅ Prediction form with live results
- ✅ Comprehensive recommendations panel

### MODULE 6 — Deployment
- ✅ Docker & Docker Compose support
- ✅ Production-ready configuration
- ✅ Environment-based settings
- ✅ Complete documentation

## 📋 Prerequisites

- **Docker & Docker Compose** (recommended) OR
- **Node.js** 18+ (for frontend)
- **Python** 3.11+ (for backend)
- **PostgreSQL** 15+ (if not using Docker)

## 🛠️ Installation & Setup

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   cd "AI Marketing Intelligence Predict Genie"
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   This will start:
   - PostgreSQL database on port 5432
   - FastAPI backend on port 8000
   - Next.js frontend on port 3000

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup PostgreSQL database**
   - Install PostgreSQL
   - Create database: `predict_genie`
   - Update `.env` file with your database credentials

5. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/predict_genie
   HOST=0.0.0.0
   PORT=8000
   ```

6. **Run the backend**
   ```bash
   python main.py
   # or
   uvicorn main:app --reload
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env.local file**
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open http://localhost:3000 in your browser

## 📊 Usage Guide

### 1. Upload Marketing Data

1. Navigate to the **Upload** page
2. Prepare a CSV file with the following columns:
   - `platform`: Social media platform (instagram, facebook, twitter, linkedin, tiktok, youtube)
   - `impressions`: Number of impressions (integer)
   - `likes`: Number of likes (integer)
   - `comments`: Number of comments (integer)
   - `shares`: Number of shares (integer)
   - `post_type`: Type of post (image, video, carousel, story, reel, text, link)
   - `caption`: Post caption (optional, string)
   - `timestamp`: Post date and time (YYYY-MM-DD HH:MM:SS)

3. Click "Choose a file" and select your CSV
4. Click "Upload Dataset"

**Sample CSV Format:**
```csv
platform,impressions,likes,comments,shares,post_type,caption,timestamp
instagram,1000,150,20,10,image,"Check this out!",2024-01-15 10:30:00
facebook,2000,300,50,25,video,"Amazing content",2024-01-16 14:00:00
twitter,500,75,15,30,text,"Great news!",2024-01-17 09:00:00
```

### 2. View Analytics

Navigate to the **Analytics** page to see:
- Total posts and average engagement rate
- Platform performance comparison
- Content type analysis
- Time-of-day engagement patterns
- Top-performing posts

### 3. Train AI Model & Make Predictions

1. Go to the **Predict** page
2. Click "Train Model" to train on your data
3. Fill out the prediction form:
   - Select platform
   - Choose content type
   - Set posting time (hour)
4. Click "Predict Engagement"
5. View predicted engagement rate and confidence score

### 4. Get AI Recommendations

Navigate to the **Recommendations** page to receive:
- Best posting times for maximum engagement
- Optimal content types for your audience
- Top-performing platforms
- Caption writing tips
- Actionable marketing strategies

## 🔌 API Endpoints

### Data Ingestion
- `POST /upload-data` - Upload CSV dataset
- `POST /add-record` - Add single marketing record

### Analytics
- `GET /analytics` - Get comprehensive analytics
- `GET /analytics/platform-comparison` - Platform performance
- `GET /analytics/content-type` - Content type analysis
- `GET /analytics/time-analysis` - Time-based analysis

### Prediction
- `POST /train-model` - Train ML model
- `POST /predict` - Predict engagement

### Recommendations
- `GET /recommendations` - Get AI recommendations

### Data Management
- `GET /data/count` - Get total record count
- `GET /data/recent` - Get recent records
- `DELETE /data/clear` - Clear all data

### Health Check
- `GET /` - API welcome message
- `GET /health` - Health check

**Full API Documentation:** http://localhost:8000/docs

## 🏗️ Project Structure

```
AI Marketing Intelligence Predict Genie/
├── backend/
│   ├── main.py                    # FastAPI application
│   ├── models.py                  # Database models
│   ├── database.py                # Database connection
│   ├── schemas.py                 # Pydantic schemas
│   ├── analytics_engine.py        # Analytics logic
│   ├── prediction_engine.py       # ML prediction
│   ├── recommendation_engine.py   # AI recommendations
│   ├── requirements.txt           # Python dependencies
│   ├── Dockerfile                 # Backend Docker config
│   └── .env.example               # Environment template
│
├── frontend/
│   ├── pages/
│   │   ├── index.tsx              # Dashboard
│   │   ├── upload.tsx             # Upload page
│   │   ├── analytics.tsx          # Analytics page
│   │   ├── predict.tsx            # Prediction page
│   │   └── recommendations.tsx    # Recommendations page
│   ├── components/
│   │   └── Layout.tsx             # Layout component
│   ├── lib/
│   │   └── api.ts                 # API utilities
│   ├── styles/
│   │   └── globals.css            # Global styles
│   ├── package.json               # Node dependencies
│   ├── Dockerfile                 # Frontend Docker config
│   └── tailwind.config.js         # Tailwind configuration
│
├── docker-compose.yml             # Docker Compose config
└── README.md                      # This file
```

## 🧪 Technology Stack

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Icons:** React Icons

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.11
- **ORM:** SQLAlchemy
- **Validation:** Pydantic
- **ML Libraries:** scikit-learn, pandas, numpy

### Database
- **DBMS:** PostgreSQL 15
- **Driver:** psycopg2-binary

### Deployment
- **Containerization:** Docker & Docker Compose
- **Web Server:** Uvicorn (ASGI)

## 📈 ML Model Details

The prediction engine uses a **Random Forest Regressor** with the following:
- **Features:** Platform (encoded), Post Type (encoded), Posting Hour
- **Target:** Engagement Rate
- **Model Parameters:**
  - n_estimators: 100
  - max_depth: 10
  - random_state: 42

The model is trained on your historical marketing data and improves with more data.

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# Restart containers
docker-compose down
docker-compose up --build
```

### Frontend Not Loading
```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run dev
```

### Backend Errors
```bash
# Check logs
docker-compose logs backend

# Restart backend only
docker-compose restart backend
```

### Model Training Fails
- Ensure you have at least 10 records in the database
- Check that your data has varied platforms and post types

## 🔐 Security Notes

- Change default PostgreSQL credentials in production
- Use strong passwords
- Enable HTTPS for production deployment
- Implement rate limiting for API endpoints
- Add authentication/authorization for sensitive endpoints

## 🚀 Production Deployment

1. **Update environment variables**
   - Set production database URL
   - Configure CORS origins
   - Set secure secrets

2. **Build for production**
   ```bash
   # Frontend
   cd frontend
   npm run build
   npm start
   
   # Backend
   cd backend
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

3. **Use a reverse proxy** (Nginx/Caddy)
4. **Setup SSL certificates** (Let's Encrypt)
5. **Configure monitoring** (health checks, logs)

## 📝 Sample Data

A sample CSV file is included in `sample_data.csv` for testing purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ using AI-assisted development

## 🙏 Acknowledgments

- FastAPI for the excellent Python framework
- Next.js for the React framework
- scikit-learn for ML capabilities
- Recharts for beautiful visualizations

---

**Need help?** Check the API documentation at http://localhost:8000/docs

**Found a bug?** Please open an issue with details.

**Want to contribute?** Pull requests are welcome!
