
import math

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import router
from app.config import settings
from app.services.model_service import ModelService


def create_app(model_dir: str | None = None) -> FastAPI:
    app = FastAPI(title="Iris AI Studio API", version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.origins,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )

    app.state.models = ModelService(model_dir or settings.model_dir)
    app.include_router(router)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:
        errors = []

        for error in exc.errors():
            safe_error = dict(error)
            value = safe_error.get("input")

            if isinstance(value, float) and not math.isfinite(value):
                safe_error["input"] = str(value)

            if "ctx" in safe_error:
                safe_error["ctx"] = {
                    key: str(val) if isinstance(val, ValueError) else val
                    for key, val in safe_error["ctx"].items()
                }

            errors.append(safe_error)

        return JSONResponse(
            status_code=422,
            content={"detail": errors},
        )

    return app


app = create_app()
