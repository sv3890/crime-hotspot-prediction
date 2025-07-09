# Crime Hotspot Prediction

A full-stack web application for real-time crime reporting, geospatial analytics, and predictive insights for Indian cities.

---

## 🚀 Features

- **Real-time Crime Reporting:** Instantly report crimes and receive community alerts.
- **Geospatial Analytics:** Interactive maps and city-wise heatmaps to visualize crime hotspots and trends (React + Leaflet).
- **Data-driven Insights:** Analyze crime trends, peak times, and demographic breakdowns (gender, age, weapon, etc.).
- **Predictive Modeling:** Machine learning models (Gradient Boosting, Prophet) for crime trend forecasting and risk prediction.
- **Advanced Feature Engineering:** Includes per-capita, police density, CCTV density, and more.
- **RESTful API Backend:** FastAPI endpoints for reporting, analytics, and ML inference.
- **Automated Notifications:** Email alerts and PDF/CSV report export for users and subscribers.
- **Community Engagement:** Subscription and notification features to foster safer neighborhoods.

---

## 🛠️ Tech Stack

- **Backend:** Python, FastAPI, scikit-learn, Prophet, Pandas
- **Frontend:** React, Material-UI, Leaflet
- **Database:** MongoDB (or your preferred DB)
- **ML:** GradientBoostingRegressor, LabelEncoder, GridSearchCV

---

## 📊 Machine Learning Pipeline

- Loads and processes the full dataset (`india_crime_dataset.csv`).
- Feature engineering: CrimePerCapita, PoliceDensity, CCTVDensity, CrimeLoadPerOfficer, etc.
- Label encoding for categorical features (State, City, CrimeType, WeatherCondition).
- Model pipeline: StandardScaler + GradientBoostingRegressor.
- Hyperparameter tuning with GridSearchCV and cross-validation.
- Model evaluation: MSE, R², and custom accuracy metrics.
- Model and encoders saved for production inference.

---

## 🌏 Geospatial Analytics

- City coordinates mapped for all major Indian cities.
- Map endpoints return latitude/longitude for incidents.
- Frontend displays interactive maps with color-coded markers for each crime type.
- Legend for crime types and colors is auto-generated from the backend.

---

## 📦 Project Structure

```
srccW/
  backend/      # FastAPI backend, ML, data processing
  frontend/     # React frontend, map visualizations, dashboards
  ...           # Models, scripts, data, etc.
```

---

## 📝 How to Run

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd srccW
   ```
2. **Backend:**
   - Install Python dependencies:
     ```bash
     pip install -r backend/requirements.txt
     ```
   - Start FastAPI server:
     ```bash
     uvicorn backend.main:app --reload --port 8000
     ```
3. **Frontend:**
   - Install Node dependencies:
     ```bash
     cd frontend
     npm install
     ```
   - Start React app:
     ```bash
     npm start
     ```
4. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📄 Example API Endpoints

- `/api/report` — Submit a new crime report
- `/api/map_data/crime_incidents` — Get map data for incidents
- `/api/options` — Get dropdown/filter options
- `/api/prediction` — Predict crime risk/incidents

---

## 📬 Contact

- GitHub: https://github.com/sv3890
- LinkedIn: www.linkedin.com/in/sowmya-vema-785513191
- Email: sowmivema3112@gmail.com

---

## 📑 License

[MIT License](LICENSE)

---

##  Acknowledgements

- OpenStreetMap, Leaflet, scikit-learn, Prophet, Material-UI, FastAPI, and the open-source community.

---

##  Notes

- Remove sensitive data (API keys, passwords, large datasets) before uploading to GitHub.
- Add a `.gitignore` to exclude `node_modules/`, `__pycache__/`, `.env`, and other unnecessary files.
- For large datasets, provide a download link or instructions instead of uploading the file.
