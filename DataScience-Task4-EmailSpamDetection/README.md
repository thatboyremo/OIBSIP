# OIBSIP Data Science Internship — Task 4
## SpamGuardAI: Email Spam Detection with Machine Learning

SpamGuardAI is a machine-learning web application that classifies text messages as spam or legitimate (not spam). It combines natural language processing (NLP), trained machine-learning models, and a web interface to demonstrate automated spam detection.

## Features

- Detects spam and legitimate text messages.
- Supports Multinomial Naive Bayes and Logistic Regression models.
- Displays prediction confidence scores.
- Uses TF-IDF to convert text into numerical features.
- Provides a responsive interface built with React and TypeScript.
- Uses a Python FastAPI backend to serve predictions.

## Technologies Used

- Python
- pandas and scikit-learn
- TF-IDF text vectorization
- Multinomial Naive Bayes
- Logistic Regression
- FastAPI
- React and TypeScript
- Tailwind CSS
- Joblib for loading saved machine-learning artifacts

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

## How to Run the Project

### 1. Start the backend

Open PowerShell in the project folder and run:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m pip install joblib nltk
python -m uvicorn main:app --reload
```

The API should start at `http://127.0.0.1:8000`.

You can check the health endpoint at `http://127.0.0.1:8000/health`.

If model loading fails, check the installed scikit-learn version against the version used to train the saved models.

### 2. Start the frontend

Open a second PowerShell terminal in the project root and run:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite in your browser. Ensure the frontend API URL in `src/api.ts` points to the running backend.

## Machine-Learning Workflow

1. Receive a text message.
2. Apply the project's text preprocessing.
3. Transform the message using the saved TF-IDF vectorizer.
4. Generate a prediction with the selected trained model.
5. Return the predicted class and confidence information to the interface.

## Project Objective

The objective of this project is to demonstrate how natural language processing and supervised machine learning can be applied to identify potentially unwanted messages.

## Notes

The saved model files and vectorizer are included in the `backend/models/` directory. Model evaluation metrics should be reported only when verified against the evaluation results.

This project was developed for the Oasis Infobyte Internship (OIBSIP), Data Science Task 4: Email Spam Detection with Machine Learning.
