# AutoValue AI

**Know What Your Car Is Worth.** A full-stack app that estimates a used car's selling price with a trained scikit-learn model.

React + TypeScript frontend → FastAPI backend → your real `car_price_model.pkl`. No prices or metrics are hardcoded or faked.

## Features
- Animated landing page (hero demo is clearly labelled **Demo Preview** and is never model output)
- `/predict` form with client validation and server-side Pydantic validation
- Result card with count-up animation, saved to `localStorage` history
- `/history` (delete one / clear all) and `/dashboard` (stats + Recharts activity chart from real history)
- Dark-first theme with persisted light mode, mobile menu, skeleton loaders, reduced-motion support
- Model Performance section that shows metrics **only** once you fill in `frontend/src/config/modelMetrics.ts`

## Tech stack
Frontend: React 18, TypeScript, Vite, Tailwind CSS 3, Framer Motion, Lucide, Recharts, React Router.
Backend: FastAPI, Uvicorn, Pydantic v2, pandas, numpy, scikit-learn, joblib.

## The model (verified from your file)
- A scikit-learn `Pipeline`: `ColumnTransformer` (OneHotEncoder on `brand`, `seller_type`, `fuel_type`, `transmission_type`; numeric columns passed through) → `RandomForestRegressor(n_estimators=200)`.
- Expected columns, in order: `brand, vehicle_age, km_driven, seller_type, fuel_type, transmission_type, mileage, engine, max_power, seats`.
- Categories are **lowercase** and the encoder uses `handle_unknown="ignore"`. Sending `"Toyota"` would not error: it would be silently encoded as "unknown" and return a *different, wrong* price (measured: 474,039 vs 518,513 for the same Maruti). The backend therefore lowercases input and rejects unknown categories with a 422.
- Dropdown options come from `GET /metadata`, read from the fitted encoder, so they can never drift from the model.
- Pickled with **scikit-learn 1.7.2**; `requirements.txt` pins it.
- The model returns prices in the currency of its training data. The magnitudes indicate Indian rupees (a 5-year-old Maruti ≈ 474k). The UI shows **naira** by converting model output with `VITE_PRICE_MULTIPLIER` (naira per 1 rupee, default 13.8 from early Oct 2026). This is a fixed, approximate rate: update it when exchange rates move. The result card states the conversion. Set `VITE_CURRENCY=INR` and `VITE_PRICE_MULTIPLIER=1` to see raw model output. Note: a rupee price converted to naira is not the same as a Nigerian market price; the model learned the Indian used-car market.

## Project structure
```
autovalue-ai/
├── backend/   main.py (API) · predictor.py (load + inference) · model/ (put the .pkl here)
└── frontend/  src/{components,pages,sections,hooks,lib,types,config}
```

## Run locally
Backend (Python 3.10+):
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp /path/to/car_price_model.pkl model/car_price_model.pkl
cp .env.example .env   # optional; export the vars or use your host's env settings
uvicorn main:app --reload
```
Check `http://localhost:8000/health` → `{"status":"ok","model_loaded":true}`.

Frontend:
```bash
cd frontend
cp .env.example .env     # VITE_API_URL=http://localhost:8000
npm install
npm run dev
```

## API
- `GET /health` · `GET /metadata` · `POST /predict`
```json
{"brand":"toyota","vehicle_age":5,"km_driven":45000,"seller_type":"individual","fuel_type":"petrol","transmission_type":"manual","mileage":18.5,"engine":1197,"max_power":82,"seats":5}
```
→ `{"predicted_price": <float>}`. Errors use `{"error":{"code","message"}}`; stack traces stay in server logs.

## Deploy
**Frontend (Vercel):** import the repo, root directory `frontend`, set `VITE_API_URL` (and `VITE_CURRENCY`) to your backend URL. `vercel.json` handles SPA routing.

**Backend (Render/Railway):** root directory `backend`, build `pip install -r requirements.txt`, start `uvicorn main:app --host 0.0.0.0 --port $PORT`. Set `CORS_ORIGINS` to your Vercel URL(s), comma-separated.

**Heads-up on the model file:**
- It is ~200 MB, over GitHub's 100 MB limit. Use Git LFS, or store it externally and download it at build/start.
- Loading it peaked around 540 MB RAM when measured, so a 512 MB free instance will likely run out of memory. Use a larger instance, or retrain with smaller forests (e.g. fewer trees, `min_samples_leaf`, `max_depth`) and re-export.
- `scripts/compress_model.py` shrinks the file on disk, not the RAM needed.

## Known limits
The model returns one price: no confidence interval is shown, and none is invented.

## Troubleshooting: "The prediction model is currently unavailable."
The API is running but could not load the model. The zip does **not** include `car_price_model.pkl` (it is ~200 MB), so the usual cause is that the file is not in place.
1. Put the file at `backend/model/car_price_model.pkl` (exact name).
2. From `backend/`, run `python check_model.py`. It prints the exact reason (file missing, wrong scikit-learn version, incompatible model).
3. Restart `uvicorn main:app --reload` and open `http://localhost:8000/health`: `"model_loaded": true` means it worked; otherwise `model_error` shows `file_not_found`, `load_failed` or `incompatible_model`.
4. If it says `load_failed`, run `pip install scikit-learn==1.7.2` and use Python 3.10+.
