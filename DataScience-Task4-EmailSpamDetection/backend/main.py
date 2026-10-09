"""
Spam Detection FastAPI Backend
Loads pre-trained ML models (.pkl) and exposes a prediction endpoint.
"""

import os
import importlib.util
import logging
from typing import Literal

try:
    import joblib  # type: ignore[import-not-found]
except ModuleNotFoundError:
    joblib = None

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
NAIVE_BAYES_PATH = os.path.join(MODELS_DIR, "naive_bayes_model.pkl")
LOGISTIC_REGRESSION_PATH = os.path.join(MODELS_DIR, "logistic_regression_model.pkl")
TFIDF_PATH = os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl")
PREPROCESSING_PATH = os.path.join(MODELS_DIR, "preprocessing.py")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Load preprocessing module
# ---------------------------------------------------------------------------
preprocessing_module = None


def load_preprocessing():
    """Load the user-supplied preprocessing.py as a module."""
    global preprocessing_module
    if not os.path.exists(PREPROCESSING_PATH):
        raise FileNotFoundError(
            f"preprocessing.py not found at {PREPROCESSING_PATH}. "
            "Please upload it to the backend/models/ directory."
        )
    spec = importlib.util.spec_from_file_location("preprocessing", PREPROCESSING_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError("Could not load preprocessing.py as a module.")
    preprocessing_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(preprocessing_module)
    logger.info("Loaded preprocessing.py successfully.")


def preprocess_text(text: str) -> str:
    """
    Apply the same preprocessing used during model training.
    Looks for a common function name in the supplied preprocessing module.
    """
    if preprocessing_module is None:
        return text

    # Try common preprocessing function names
    candidates = [
        "preprocess_text",
        "preprocess",
        "clean_text",
        "transform_text",
        "normalize_text",
    ]
    for name in candidates:
        func = getattr(preprocessing_module, name, None)
        if callable(func):
            return func(text)

    logger.warning(
        "No preprocessing function found in preprocessing.py. "
        "Looked for: %s. Using raw text.", ", ".join(candidates)
    )
    return text


# ---------------------------------------------------------------------------
# Load models and vectorizer
# ---------------------------------------------------------------------------
def load_pickle(path: str, name: str):
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"{name} not found at {path}. "
            f"Please upload it to the backend/models/ directory."
        )
    obj = joblib.load(path)
    logger.info("Loaded %s successfully.", name)
    return obj


models: dict[str, object] = {}
tfidf_vectorizer = None
models_loaded = False
load_error: str | None = None


def load_all():
    """Load vectorizer, both models, and the preprocessing module."""
    global tfidf_vectorizer, models_loaded, load_error
    try:
        load_preprocessing()
        tfidf_vectorizer = load_pickle(TFIDF_PATH, "TF-IDF vectorizer")
        models["naive_bayes"] = load_pickle(NAIVE_BAYES_PATH, "Naive Bayes model")
        models["logistic_regression"] = load_pickle(
            LOGISTIC_REGRESSION_PATH, "Logistic Regression model"
        )
        models_loaded = True
        logger.info("All models and vectorizer loaded successfully.")
    except Exception as e:
        load_error = str(e)
        models_loaded = False
        logger.error("Failed to load models: %s", e)


# Attempt to load on startup
load_all()

# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="SpamGuard AI API",
    description="NLP-powered spam detection API using TF-IDF and ML classification models.",
    version="1.0.0",
)

# CORS — allow all origins for development; tighten in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class PredictRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000, description="The text message to classify")
    model: Literal["naive_bayes", "logistic_regression"] = Field(
        default="naive_bayes", description="Which model to use for prediction"
    )


class Probabilities(BaseModel):
    ham: float
    spam: float


class PredictionResponse(BaseModel):
    label: str
    is_spam: bool
    confidence: float
    probabilities: Probabilities


class HealthResponse(BaseModel):
    status: str
    models_loaded: bool
    error: str | None = None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health", response_model=HealthResponse)
async def health():
    if models_loaded:
        return HealthResponse(status="healthy", models_loaded=True)
    return HealthResponse(
        status="unhealthy",
        models_loaded=False,
        error=load_error or "Models not loaded.",
    )


@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictRequest):
    if not models_loaded or tfidf_vectorizer is None:
        raise HTTPException(
            status_code=503,
            detail="Models are not loaded. Predictions are temporarily unavailable. "
            f"Error: {load_error}",
        )

    model_key = request.model
    model = models.get(model_key)
    if model is None:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown model: {model_key}. Available: {list(models.keys())}",
        )

    try:
        # Preprocess the input text using the training-time pipeline
        processed = preprocess_text(request.message)

        # Transform text to TF-IDF features
        features = tfidf_vectorizer.transform([processed])

        # Predict
        prediction = model.predict(features)[0]

        # Get probability estimates (both NB and LR support predict_proba)
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(features)[0]
            classes = list(model.classes_)
            prob_map = {cls: float(p) for cls, p in zip(classes, proba)}

            # Determine spam probability based on class labels
            # Class labels may be 0/1, "ham"/"spam", or similar
            spam_key = None
            ham_key = None
            for cls in classes:
                cls_str = str(cls).lower()
                if cls_str in ("1", "spam", "true"):
                    spam_key = cls
                elif cls_str in ("0", "ham", "false"):
                    ham_key = cls

            if spam_key is None or ham_key is None:
                # Fallback: assume last class is spam
                spam_key = classes[-1]
                ham_key = classes[0]

            spam_prob = prob_map[spam_key]
            ham_prob = prob_map[ham_key]
            confidence = max(spam_prob, ham_prob)
        else:
            # Fallback if model doesn't support probabilities
            spam_prob = 1.0 if str(prediction).lower() in ("1", "spam", "true") else 0.0
            ham_prob = 1.0 - spam_prob
            confidence = 1.0

        is_spam = str(prediction).lower() in ("1", "spam", "true")
        label = "spam" if is_spam else "ham"

        return PredictionResponse(
            label=label,
            is_spam=is_spam,
            confidence=confidence,
            probabilities=Probabilities(ham=ham_prob, spam=spam_prob),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Prediction error: %s", e, exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during prediction: {str(e)}",
        )


@app.get("/")
async def root():
    return {
        "name": "SpamGuard AI API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "predict": "/predict",
    }


# ---------------------------------------------------------------------------
# Startup event — attempt reload if initial load failed
# ---------------------------------------------------------------------------
@app.on_event("startup")
async def startup_event():
    if not models_loaded:
        logger.info("Attempting to reload models on startup...")
        load_all()
