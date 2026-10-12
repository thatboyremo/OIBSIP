"""Checks that artifacts/evaluation.json matches a fresh evaluation of the saved files (no FastAPI needed)."""
import json
from pathlib import Path
import joblib, pandas as pd, pytest
from sklearn.datasets import load_iris
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parents[2]
ART = json.loads((ROOT / "artifacts" / "evaluation.json").read_text())


def _test_split():
    iris = load_iris()
    X = pd.DataFrame(iris.data, columns=iris.feature_names)
    _, Xte, _, yte = train_test_split(X, iris.target, test_size=0.2, random_state=42, stratify=iris.target)
    return Xte, yte


def test_saved_model_metrics_match_artifact():
    model = joblib.load(ROOT / "backend/models/iris_model.pkl")
    scaler = joblib.load(ROOT / "backend/models/iris_scaler.pkl")
    Xte, yte = _test_split()
    pred = model.predict(scaler.transform(Xte))
    saved = next(m for m in ART["models"] if m["provenance"] == "saved_model")
    assert accuracy_score(yte, pred) == pytest.approx(saved["accuracy"])
    assert confusion_matrix(yte, pred).tolist() == saved["confusion_matrix"]
    assert sorted(Xte.index.tolist()) == ART["test_row_indices"]


def test_all_verification_checks_passed():
    assert ART["verification"] and all(c["passed"] for c in ART["verification"])
