"""Loads the saved scaler + classifier once and runs real predictions."""
from pathlib import Path
import joblib
import pandas as pd

# Feature order and names used when the scaler was fitted (verified from the pickle).
FEATURES = ["sepal length (cm)", "sepal width (cm)", "petal length (cm)", "petal width (cm)"]
# Species names for class indices 0..2, from sklearn.datasets.load_iris().target_names.
SPECIES = ["setosa", "versicolor", "virginica"]


class ModelUnavailable(RuntimeError):
    pass


class ModelService:
    def __init__(self, model_dir: str):
        self.model = None
        self.scaler = None
        self.error: str | None = None
        self._load(Path(model_dir))

    def _load(self, d: Path) -> None:
        try:
            self.model = joblib.load(d / "iris_model.pkl")
            self.scaler = joblib.load(d / "iris_scaler.pkl")
            names = list(getattr(self.scaler, "feature_names_in_", FEATURES))
            if names != FEATURES or self.scaler.n_features_in_ != 4:
                raise ValueError("scaler feature order does not match expected order")
            if [int(c) for c in self.model.classes_] != [0, 1, 2]:
                raise ValueError("unexpected class labels")
        except Exception as exc:  # keep detail generic for clients
            self.model = self.scaler = None
            self.error = f"Model files could not be loaded ({type(exc).__name__})"

    @property
    def ready(self) -> bool:
        return self.model is not None and self.scaler is not None

    @property
    def model_type(self) -> str | None:
        return type(self.model).__name__ if self.model is not None else None

    def predict(self, sl: float, sw: float, pl: float, pw: float) -> dict:
        if not self.ready:
            raise ModelUnavailable(self.error or "Model not loaded")
        x = pd.DataFrame([[sl, sw, pl, pw]], columns=FEATURES)
        xs = self.scaler.transform(x)
        idx = int(self.model.predict(xs)[0])
        probs = None
        if hasattr(self.model, "predict_proba"):
            p = self.model.predict_proba(xs)[0]
            probs = {SPECIES[int(c)]: float(p[i]) for i, c in enumerate(self.model.classes_)}
        return {"prediction": SPECIES[idx], "prediction_index": idx,
                "probabilities": probs, "model_name": self.model_type}
