# Deployment Guide

## Backend Deployment (Render / Railway / AWS EC2)

## Required files
- `server/server.py`
- `server/util.py`
- `server/requirements.txt`
- `model/bangalore_home_prices_model.pickle`
- `model/columns.json`

## Build/start commands
- Install: `pip install -r server/requirements.txt`
- Start: `python server/server.py`

## Environment
- `PORT` is optional locally; platforms usually inject it automatically.

## Notes
- Keep `model/` folder deployed with backend service.
- Enable HTTPS via platform defaults.
- Add request logging and rate limits for production.

## Frontend Deployment (Vercel / Netlify)

## Build settings
- Root directory: `client`
- Install command: `npm install`
- Build command: `npm run build`
- Publish directory: `client/dist` (Netlify) or auto-detected dist (Vercel)

## Environment variable
- `VITE_API_BASE_URL=https://<your-backend-domain>`

## Optional optimization
- Add CDN caching headers for static assets.
- Configure custom domain and strict HTTPS.

## Post-deploy verification

1. Open frontend and confirm location dropdown loads.
2. Call backend health endpoint:
   - `GET /health`
3. Run a sample prediction:
   - `POST /predict_home_price`
4. Verify CORS behavior from deployed frontend origin.
