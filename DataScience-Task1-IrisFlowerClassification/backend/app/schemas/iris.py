import math
from pydantic import BaseModel, ConfigDict, field_validator

LIMITS = {  # generous physical bounds in cm; rejects obvious data-entry errors
    "sepal_length": (0.1, 15.0),
    "sepal_width": (0.1, 10.0),
    "petal_length": (0.1, 15.0),
    "petal_width": (0.01, 10.0),
}


class PredictRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=False)
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float

    @field_validator("*")
    @classmethod
    def _check(cls, v: float, info):
        if not math.isfinite(v):
            raise ValueError("must be a finite number")
        lo, hi = LIMITS[info.field_name]
        if not lo <= v <= hi:
            raise ValueError(f"must be between {lo} and {hi} cm")
        return v


class PredictResponse(BaseModel):
    prediction: str
    prediction_index: int
    probabilities: dict[str, float] | None
    model_name: str


class HealthResponse(BaseModel):
    status: str  # "ok" | "degraded"
    model_loaded: bool
    scaler_loaded: bool
    model_type: str | None
    detail: str | None = None
