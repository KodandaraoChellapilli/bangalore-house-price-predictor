# Bangalore Housing Price Prediction SaaS

Production-style end-to-end machine learning web app that predicts Bangalore house prices from:
- Total square feet
- BHK
- Bathrooms
- Location

Tech stack:
- Frontend: React + TypeScript + Vite + Tailwind CSS + Axios + Framer Motion
- Backend: Flask + Flask-CORS
- ML: Scikit-learn + NumPy + Pandas (model artifact loaded from pickle)

This project reuses the same modeling logic from your notebook (`FirstHousingprice (1) (1).ipynb`) with the same:
- cleaning steps
- feature engineering
- outlier rules
- one-hot encoding behavior
- feature column order

## Project Structure

```text
HousingPriceModel/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── PredictionForm.tsx
│   │   │   ├── PriceResult.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── Footer.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── types.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── server/
│   ├── server.py
│   ├── util.py
│   ├── requirements.txt
│   └── .env.example
├── model/
│   ├── train_model.py
│   ├── bangalore_home_prices_model.pickle
│   ├── banglore_home_prices_model.pickle
│   └── columns.json
├── data/
│   └── bengaluru_house_prices.csv
├── DEPLOYMENT.md
└── README.md
```

## Features

- Dark themed modern SaaS-style UI
- Glassmorphism cards and gradient backgrounds
- Responsive layout for mobile/desktop
- Location list loaded from backend API on page load
- Prediction form validation
- Loading spinner + skeleton loading states
- Toast notifications for success and failure
- Animated transitions using Framer Motion
- Dark/light mode toggle
- Prediction history persisted in localStorage
- Trend chart using Chart.js (`react-chartjs-2`)

## API Endpoints

### `GET /get_location_names`
Response:
```json
{
  "locations": ["1st phase jp nagar", "indira nagar", "whitefield"]
}
```

### `POST /predict_home_price`
Request body:
```json
{
  "total_sqft": 1200,
  "bhk": 2,
  "bath": 2,
  "location": "indira nagar"
}
```

Response:
```json
{
  "estimated_price": 125.67
}
```

## Local Setup

## 1) Train model artifacts from notebook-equivalent pipeline

The script below reproduces the notebook preprocessing and exports:
- `model/bangalore_home_prices_model.pickle`
- `model/banglore_home_prices_model.pickle` (notebook-compatible filename)
- `model/columns.json` (auto-generated with lowercased feature order)

```bash
python model/train_model.py
```

## 2) Backend setup

```bash
cd server
python -m venv .venv
```

Windows:
```bash
.venv\Scripts\activate
```

macOS/Linux:
```bash
source .venv/bin/activate
```

Install packages:
```bash
pip install -r requirements.txt
```

Run server:
```bash
python server.py
```

Backend runs on `http://127.0.0.1:5000`.

## 3) Frontend setup

```bash
cd client
npm install
```

Create `.env` from example:
```bash
cp .env.example .env
```
On Windows PowerShell:
```bash
Copy-Item .env.example .env
```

Run frontend:
```bash
npm run dev
```

Frontend runs on `http://127.0.0.1:5173`.

## Environment Variables

### Frontend (`client/.env`)
- `VITE_API_BASE_URL`: backend base URL (example: `http://127.0.0.1:5000`)

### Backend (`server/.env` optional)
- `PORT`: Flask port (default `5000`)

## Deployment

Detailed deployment instructions are available in `DEPLOYMENT.md`.

## Frontend Architecture (Interview Explanation)

- `App.tsx` is the orchestrator:
  - loads locations on mount
  - manages prediction request state
  - persists and restores prediction history
  - passes typed props to presentational components
- `services/api.ts` centralizes HTTP logic using an Axios instance.
- `types/types.ts` ensures strongly typed request/response contracts.
- Components are modular:
  - `Navbar`: branding + theme toggle
  - `Hero`: marketing heading and value proposition
  - `PredictionForm`: validated user input workflow
  - `PriceResult`: prediction output + trend + history
  - `Footer`: product footer

## Backend Architecture (Interview Explanation)

- `server.py` hosts API routes and request validation.
- `util.py` handles model artifact loading and prediction logic.
- Artifacts are loaded once in memory to avoid repeated disk I/O.
- API returns clean JSON responses and HTTP 400 on invalid inputs.

## End-to-End Request Lifecycle

1. User submits the form on frontend.
2. `PredictionForm` sends typed payload to `predictPrice()` in API service.
3. Axios performs POST to Flask `/predict_home_price`.
4. Flask validates payload and calls `util.get_estimated_price()`.
5. Utility builds NumPy feature vector and executes model prediction.
6. Backend returns `estimated_price` JSON.
7. Frontend shows result card, pushes to local history, updates chart, and shows toast.

## ML Prediction Workflow

- `columns.json` defines feature ordering.
- Model expects vector format:
  - index 0: `sqft`
  - index 1: `bath`
  - index 2: `bhk`
  - remaining one-hot encoded locations
- Unknown location fallback keeps one-hot vector all zeros.

## Real-world Production Considerations

- Add API authentication/rate limiting before public exposure.
- Add monitoring (request logs, model latency, error rates).
- Version model artifacts and support rollback.
- Add data drift checks and retraining pipeline.
- Move localStorage history to database for multi-device persistence.
