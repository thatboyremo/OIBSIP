"""AutoValue AI – FastAPI service wrapping the trained scikit-learn pipeline."""
from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Literal


from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field, field_validator

from predictor import InvalidCategory, ModelUnavailable, Predictor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("autovalue.api")

BASE_DIR = Path(__file__).resolve().parent


def _model_path() -> Path:
    raw = Path(os.getenv("MODEL_PATH", "model/car_price_model.pkl"))
    return raw if raw.is_absolute() else BASE_DIR / raw


def _origins() -> list[str]:
    raw = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,"
        "http://localhost:5174,http://127.0.0.1:5174",
    )
    return [o.strip().rstrip("/") for o in raw.split(",") if o.strip()]


@asynccontextmanager
async def lifespan(app: FastAPI):
    predictor = Predictor(_model_path())
    try:
        predictor.load()  # loaded ONCE at startup, not per request
    except ModelUnavailable as exc:
        logger.error("Model unavailable at startup (%s): %s. Expected file: %s", predictor.error_code, exc, predictor.model_path)
    app.state.predictor = predictor
    yield


app = FastAPI(title="AutoValue AI API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins(),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


class PredictionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    brand: str = Field(min_length=1, max_length=64)
    vehicle_age: float = Field(ge=0, le=60, allow_inf_nan=False)
    km_driven: float = Field(gt=0, le=5_000_000, allow_inf_nan=False)
    seller_type: str = Field(min_length=1, max_length=64)
    fuel_type: str = Field(min_length=1, max_length=64)
    transmission_type: str = Field(min_length=1, max_length=64)
    mileage: float = Field(gt=0, le=200, allow_inf_nan=False)
    engine: float = Field(gt=0, le=20_000, allow_inf_nan=False)
    max_power: float = Field(gt=0, le=2_000, allow_inf_nan=False)
    seats: int = Field(ge=1, le=14)

    @field_validator("brand", "seller_type", "fuel_type", "transmission_type")
    @classmethod
    def _lower(cls, v: str) -> str:
        return v.strip().lower()


class PredictionResponse(BaseModel):
    predicted_price: float


def _error(status: int, code: str, message: str) -> JSONResponse:
    return JSONResponse(status_code=status, content={"error": {"code": code, "message": message}})


@app.exception_handler(RequestValidationError)
async def _validation_handler(_: Request, exc: RequestValidationError):
    fields = sorted({str(e["loc"][-1]) for e in exc.errors() if e.get("loc")})
    return _error(422, "invalid_input", f"Please check these fields: {', '.join(fields) or 'request body'}.")


@app.exception_handler(Exception)
async def _unhandled(_: Request, exc: Exception):
    logger.exception("Unhandled error", exc_info=exc)  # stack trace stays in server logs only
    return _error(500, "internal_error", "Something went wrong. Please try again.")


@app.get("/health")
def health(request: Request):
    p: Predictor = request.app.state.predictor
    return {"status": "ok", "model_loaded": p.ready, "model_error": p.error_code}


@app.get("/metadata")
def metadata(request: Request):
    """Accepted categorical values, read from the trained encoder (never hand-written)."""
    p: Predictor = request.app.state.predictor
    if not p.ready:
        return _error(503, "model_unavailable", "The prediction model is currently unavailable.")
    return {"options": p.options}


@app.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest, request: Request):
    p: Predictor = request.app.state.predictor
    if not p.ready:
        return _error(503, "model_unavailable", "The prediction model is currently unavailable.")
    try:
        price = p.predict(payload.model_dump())
    except InvalidCategory as exc:
        return _error(422, "invalid_category", f"'{exc.value}' is not a supported {exc.field.replace('_', ' ')}.")
    except ModelUnavailable:
        return _error(503, "model_unavailable", "The prediction model is currently unavailable.")
    return PredictionResponse(predicted_price=round(price, 2))
