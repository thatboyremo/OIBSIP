# Iris AI Studio

An interactive web app around a saved scikit-learn Iris classifier. A React frontend sends measurements to a FastAPI backend, which applies the saved `StandardScaler` and `LogisticRegression` (`backend/models/iris_scaler.pkl`, `iris_model.pkl`) and returns the prediction and class probabilities. The pickle files are never exposed to the browser.

## Features
Overview, Live Predictor, Species Explorer, Dataset Explorer (histograms, scatter plots, Pearson correlation heatmap, searchable table), Model Evaluation, Prediction History (browser session storage), Settings, About, a pipeline animation that mirrors the backend, and a persisted light/dark theme.

## Stack
Frontend: React, TypeScript, Vite, Tailwind CSS 4, Recharts, Framer Motion, Lucide. Backend: Python, FastAPI, Pydantic, scikit-learn, joblib. Tests: pytest, Vitest, React Testing Library.

## Folder structure
    backend/   app/ (api, schemas, services), models/ (the two .pkl files), tests/, requirements.txt, pytest.ini
    frontend/  src/ (pages, components, lib, services, data), public/evaluation.json, package.json
    artifacts/ evaluation.json and README.md
    scripts/   export_artifacts.py (verifies the saved files and regenerates artifacts)

## Prerequisites (Windows)
- Python 3.11 or newer (scikit-learn 1.8 needs it). Check with `py --version`.
- Node.js 20 or newer. Check with `node -v`.
- The pickles were saved with scikit-learn 1.8.0, so `requirements.txt` pins `scikit-learn==1.8.0`. Other versions may load them with warnings or fail.

## Run the backend (PowerShell)
    cd backend
    py -m venv .venv
    .venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    copy .env.example .env
    uvicorn app.main:app --reload --port 8000
If activation is blocked, run `Set-ExecutionPolicy -Scope Process Bypass` first.

## Run the frontend (a second PowerShell window)
    cd frontend
    npm install
    copy .env.example .env
    npm run dev
Open http://localhost:5173.

## Environment variables
| Where | Name | Default | Purpose |
|---|---|---|---|
| backend/.env | MODEL_DIR | models | folder holding the two .pkl files |
| backend/.env | CORS_ORIGINS | http://localhost:5173 | comma-separated allowed frontend origins |
| frontend/.env | VITE_API_URL | http://localhost:8000 | API base URL |

## API
    GET /api/v1/health
    POST /api/v1/predict   {"sepal_length":5.1,"sepal_width":3.5,"petal_length":1.4,"petal_width":0.2}
Example (PowerShell):
    curl.exe -X POST http://localhost:8000/api/v1/predict -H "Content-Type: application/json" -d "{\"sepal_length\":5.1,\"sepal_width\":3.5,\"petal_length\":1.4,\"petal_width\":0.2}"
Validation: all four fields are required, extra fields are rejected, and values must be finite numbers in these ranges (cm): sepal length 0.1 to 15, sepal width 0.1 to 10, petal length 0.1 to 15, petal width 0.01 to 10. Invalid input returns 422. If the model files cannot be loaded, health reports `degraded` and predict returns 503.

## Tests
    cd backend && pytest
    cd frontend && npm test
    cd frontend && npm run build

## Regenerate evaluation artifacts
From the repo root, with the backend environment active:
    python scripts/export_artifacts.py path\to\IRIS_FLOWER_CLASSIFICATION.ipynb
The notebook path is optional; with it, the script also compares against the accuracies the notebook printed. It checks the saved files against the notebook configuration, then rewrites `artifacts/evaluation.json`, `frontend/public/evaluation.json` and `frontend/src/data/iris.json`. It exits with an error if any check fails.

## Verified evaluation results
Reproduced on the notebook split (test_size 0.20, random_state 42, stratified: 120 train, 30 test rows).

| Model | Accuracy | Confusion matrix (rows actual, columns predicted) |
|---|---|---|
| Logistic Regression (the saved model) | 93.3% (28 of 30), matches the notebook | setosa 10/0/0, versicolor 0/9/1, virginica 0/1/9 |
| KNN, n_neighbors=5 (refit from notebook config; not saved) | 93.3% (28 of 30), matches the notebook | setosa 10/0/0, versicolor 0/10/0, virginica 0/2/8 |

Checks that passed: the saved scaler's mean and scale equal a scaler fit on the training rows; the saved model's coefficients and intercepts equal a refit `LogisticRegression(max_iter=200)` (maximum difference about 2e-14); class order is 0, 1, 2; feature order is as listed; the saved model supports `predict_proba`. The 30 test rows are small, so each error moves accuracy by 3.3 points.

## Deployment (not yet tested)
- API (Render or Railway): root `backend`, build `pip install -r requirements.txt`, start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`, health check `/api/v1/health`, set `CORS_ORIGINS` to your frontend URL. Use Python 3.11 or newer.
- Frontend (Vercel): root `frontend`, set `VITE_API_URL` to the API URL. `vercel.json` rewrites routes to `index.html`.
