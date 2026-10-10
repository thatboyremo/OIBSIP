"""Diagnose why the API says "The prediction model is currently unavailable."
Run from the backend/ folder:  python check_model.py
"""
import os, platform, sys, warnings
from pathlib import Path

BASE = Path(__file__).resolve().parent
raw = Path(os.getenv("MODEL_PATH", "model/car_price_model.pkl"))
path = raw if raw.is_absolute() else BASE / raw

print(f"Python        : {platform.python_version()}")
try:
    import sklearn
    print(f"scikit-learn  : {sklearn.__version__}  (model was saved with 1.7.2)")
except ImportError:
    sys.exit("FAIL: scikit-learn is not installed. Run: pip install -r requirements.txt")
print(f"Looking for   : {path}")

if not path.is_file():
    sys.exit(
        "FAIL: model file not found.\n"
        "Copy car_price_model.pkl into backend/model/ (or set MODEL_PATH), then restart uvicorn.\n"
        "Check the file name exactly: car_price_model.pkl"
    )
print(f"File size     : {path.stat().st_size / 1e6:.0f} MB")

from predictor import ModelUnavailable, Predictor  # noqa: E402

warnings.simplefilter("default")
p = Predictor(path)
try:
    p.load()
except ModelUnavailable as exc:
    print(f"FAIL ({p.error_code}): {exc}")
    print("Most common fix: pip install scikit-learn==1.7.2 (same version the model was saved with), and use Python 3.10+.")
    sys.exit(1)
print("OK: model loaded.")
print("Feature order :", p.feature_order)
print("Options       :", {k: len(v) for k, v in p.options.items()})
