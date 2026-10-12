from fastapi import APIRouter, HTTPException, Request
from app.schemas.iris import PredictRequest, PredictResponse, HealthResponse
from app.services.model_service import ModelUnavailable

router = APIRouter(prefix="/api/v1")


@router.get("/health", response_model=HealthResponse)
def health(request: Request):
    svc = request.app.state.models
    return HealthResponse(
        status="ok" if svc.ready else "degraded",
        model_loaded=svc.model is not None,
        scaler_loaded=svc.scaler is not None,
        model_type=svc.model_type,
        detail=svc.error,
    )


@router.post("/predict", response_model=PredictResponse)
def predict(body: PredictRequest, request: Request):
    try:
        return request.app.state.models.predict(
            body.sepal_length, body.sepal_width, body.petal_length, body.petal_width)
    except ModelUnavailable:
        raise HTTPException(status_code=503, detail="Model is not available on the server.")
