# AutoValue AI — Used Car Price Prediction

AutoValue AI is a machine learning project I built to predict the selling prices of used cars based on their specifications. I wanted to take a machine learning model beyond a notebook and turn it into a web application people can interact with.

**Live Demo:** https://autovalue-ai.vercel.app/

## About the Project

The application allows users to enter details about a vehicle and get an estimated selling price. I trained a Random Forest regression model and connected it to a web interface through a FastAPI backend.

I also deployed the frontend and backend separately, making the application accessible online.

## Features

- Predicts used-car prices from vehicle details.
- Provides a simple interface for entering car specifications.
- Uses a trained machine learning model to generate predictions.
- Connects the frontend to a FastAPI backend.
- Deployed online using Vercel and Render.

## Technologies Used

- **Python** — model development and backend logic
- **scikit-learn** — machine learning
- **pandas** — data handling
- **FastAPI** — backend API
- **React, TypeScript and Vite** — frontend
- **Joblib** — saving and loading the trained model
- **Vercel and Render** — deployment
- **Git and GitHub** — version control

## How It Works

1. The user enters the vehicle's details.
2. The frontend sends the information to the backend.
3. The trained model processes the details and predicts a price.
4. The result is displayed on the website.

## Model

The project uses a Random Forest regression pipeline. To make deployment more manageable on a limited-memory hosting plan, I reduced the model from 200 trees to 30.

**Note:** The model was trained on Indian used-car data. The Nigerian naira prices shown by the application are approximate conversions of the model's predictions, not estimates trained on Nigerian market data. Actual selling prices may vary.

## Run Locally

Clone the repository:

```bash
git clone https://github.com/thatboyremo/OIBSIP.git
cd OIBSIP/DataScience-Task3-CarPricePrediction
```

Install the backend dependencies and start the FastAPI server from the `backend` directory. If the entry point is `main.py`, use:

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

In another terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Make sure the frontend API URL points to your local backend when running locally.

## Links

- **Live Application:** https://autovalue-ai.vercel.app/
- **Backend API:** https://autovalue-ai-api.onrender.com
- **API Metadata:** https://autovalue-ai-api.onrender.com/metadata
- **GitHub:** https://github.com/thatboyremo/OIBSIP

## Author

**Overcomer Toluwase**

Computer Science graduate with an interest in Machine Learning, Artificial Intelligence and Data Science.

GitHub: [@thatboyremo](https://github.com/thatboyremo)

---

This project was a practical opportunity for me to work on model development, API integration and deployment, and to understand what it takes to make a machine learning application available online.