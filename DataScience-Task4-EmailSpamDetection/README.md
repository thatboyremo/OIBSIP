# SpamGuard AI — Email Spam Detection with Machine Learning

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20App-brightgreen)](https://spamguard-ai-two.vercel.app/)
[![Backend API](https://img.shields.io/badge/API-Render-blue)](https://spamguardai-api.onrender.com)
[![API Docs](https://img.shields.io/badge/API-Documentation-orange)](https://spamguardai-api.onrender.com/docs)

**OIBSIP Data Science Internship — Task 4**

SpamGuard AI is a machine-learning web application that classifies text messages as spam or legitimate (ham). It combines natural language processing, TF-IDF text vectorization, and trained classification models with a modern web interface.

## Try the Application

**Live Demo:** https://spamguard-ai-two.vercel.app/

**API Health Check:** https://spamguardai-api.onrender.com/health

**Interactive API Documentation:** https://spamguardai-api.onrender.com/docs

## Features

- Classifies messages as spam or legitimate.
- Supports Multinomial Naive Bayes and Logistic Regression.
- Displays prediction confidence and class probabilities.
- Preprocesses text before classification.
- Converts text into numerical features using TF-IDF.
- Provides a responsive React and TypeScript interface.
- Uses a FastAPI backend to serve predictions.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Backend | Python, FastAPI, Uvicorn |
| Machine Learning | scikit-learn |
| Natural Language Processing | NLTK, TF-IDF |
| Model Persistence | Joblib |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

## How It Works

1. A user enters a message in the web interface.
2. The backend preprocesses the message.
3. The trained TF-IDF vectorizer converts the text into numerical features.
4. The selected classification model predicts whether the message is spam.
5. The API returns the predicted label, confidence, and probabilities for display.

## Project Structure

```text
DataScience-Task4-EmailSpamDetection/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── models/
│       ├── logistic_regression_model.pkl
│       ├── naive_bayes_model.pkl
│       ├── tfidf_vectorizer.pkl
│       ├── preprocessing.py
│       └── README.md
├── public/
├── src/
├── index.html
├── package.json
└── README.md
```

## Run Locally

### Prerequisites

- Python installed
- Node.js and npm installed
- Git installed

### 1. Start the backend

Open PowerShell in the project directory:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

Check the API health at `http://127.0.0.1:8000/health`.

### 2. Start the frontend

Open a second terminal in the project directory:

```powershell
npm install
```

Create a `.env.local` file in the frontend project root containing:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Then run:

```powershell
npm run dev
```

Open the local URL displayed by Vite.

For local predictions, keep the backend running while using the frontend.

## Test the API

Open the interactive API documentation:

https://spamguardai-api.onrender.com/docs

Use the `POST /predict` endpoint with a request such as:

```json
{
  "message": "Congratulations! You have won a free prize. Claim it now!",
  "model": "naive_bayes"
}
```

You can also set `"model"` to `"logistic_regression"` to use the other classifier.

## Model Artifacts

The trained models, TF-IDF vectorizer, and text preprocessing module are located in `backend/models/`.

Model performance metrics are intentionally omitted here until verified evaluation results are available.

## Project Purpose

This project demonstrates the practical application of supervised machine learning and natural language processing to text classification, from preprocessing and feature extraction to API development and deployment.

Developed for the **Oasis Infobyte Internship (OIBSIP), Data Science Task 4: Email Spam Detection with Machine Learning**.
