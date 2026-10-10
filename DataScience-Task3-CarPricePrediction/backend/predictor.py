"""Model loading + inference. Deliberately free of FastAPI imports so it can be tested alone.

The saved artifact is a scikit-learn Pipeline:
    preprocessor (ColumnTransformer: OneHotEncoder on brand/seller_type/fuel_type/transmission_type,
                  passthrough for the numeric columns) -> RandomForestRegressor
Its OneHotEncoder uses handle_unknown="ignore" and lowercase categories, so an unseen or differently
cased value (e.g. "Toyota") would NOT raise: it would be silently encoded as all-zeros and give a wrong
price. We therefore normalise to lowercase and reject unknown categories explicitly.
"""
from __future__ import annotations

import logging
import threading
from pathlib import Path
from typing import Any

import joblib
import pandas as pd

logger = logging.getLogger("autovalue.predictor")

CATEGORICAL = ("brand", "seller_type", "fuel_type", "transmission_type")
# Fallback order; the real order is taken from model.feature_names_in_ when available.
DEFAULT_ORDER = (
    "brand", "vehicle_age", "km_driven", "seller_type", "fuel_type",
    "transmission_type", "mileage", "engine", "max_power", "seats",
)


class ModelUnavailable(RuntimeError):
    """The model file is missing or could not be loaded."""


class InvalidCategory(ValueError):
    def __init__(self, field: str, value: str):
        super().__init__(f"Unsupported value for {field}: {value!r}")
        self.field = field
        self.value = value


class Predictor:
    def __init__(self, model_path: str | Path):
        self.model_path = Path(model_path)
        self._model: Any = None
        self._order: tuple[str, ...] = DEFAULT_ORDER
        self._options: dict[str, list[str]] = {}
        self._lock = threading.Lock()
        self.error_code: str | None = "not_loaded"  # safe to expose: file_not_found | load_failed | incompatible_model

    # ------------------------------------------------------------------ loading
    def load(self) -> None:
        if not self.model_path.is_file():
            self.error_code = "file_not_found"
            raise ModelUnavailable("Model file not found")
        try:
            model = joblib.load(self.model_path)
            names = getattr(model, "feature_names_in_", None)
            order = tuple(str(n) for n in names) if names is not None else DEFAULT_ORDER
            missing = set(DEFAULT_ORDER) - set(order)
            if missing:
                self.error_code = "incompatible_model"
                raise ModelUnavailable(f"Model does not expect features: {sorted(missing)}")
            options = self._extract_options(model)
            # Single-row inference: thread fan-out across 200 trees costs more than it saves.
            final = getattr(model, "named_steps", {}).get("model") if hasattr(model, "named_steps") else model
            if final is not None and hasattr(final, "n_jobs"):
                final.n_jobs = 1
        except ModelUnavailable:
            if self.error_code == "not_loaded":
                self.error_code = "incompatible_model"
            raise
        except Exception as exc:  # noqa: BLE001 - surface as a single, user-safe error type
            self.error_code = "load_failed"
            logger.exception("Failed to load model")
            raise ModelUnavailable("Model could not be loaded") from exc
        self._model, self._order, self._options = model, order, options
        self.error_code = None
        logger.info("Model loaded; feature order: %s", order)

    @staticmethod
    def _extract_options(model: Any) -> dict[str, list[str]]:
        """Read accepted categories straight from the fitted encoder(s)."""
        pre = getattr(model, "named_steps", {}).get("preprocessor")
        options: dict[str, list[str]] = {}
        for _name, transformer, cols in getattr(pre, "transformers_", []):
            enc = transformer
            if hasattr(transformer, "named_steps"):
                enc = next((s for s in transformer.named_steps.values() if hasattr(s, "categories_")), None)
            if enc is None or not hasattr(enc, "categories_"):
                continue
            for col, cats in zip(cols, enc.categories_):
                options[str(col)] = [str(c) for c in cats]
        missing = [c for c in CATEGORICAL if c not in options]
        if missing:
            raise ModelUnavailable(f"Could not read categories for: {missing}")
        return options

    # ------------------------------------------------------------------ public API
    @property
    def ready(self) -> bool:
        return self._model is not None

    @property
    def options(self) -> dict[str, list[str]]:
        return self._options

    @property
    def feature_order(self) -> tuple[str, ...]:
        return self._order

    def predict(self, features: dict[str, Any]) -> float:
        if not self.ready:
            raise ModelUnavailable("Model not loaded")
        row = dict(features)
        for col in CATEGORICAL:
            value = str(row[col]).strip().lower()
            if value not in self._options[col]:
                raise InvalidCategory(col, value)
            row[col] = value
        frame = pd.DataFrame([row], columns=list(self._order))
        with self._lock:  # sklearn predict is thread-safe, lock is just belt and braces for tiny hosts
            result = self._model.predict(frame)
        return float(result[0])
