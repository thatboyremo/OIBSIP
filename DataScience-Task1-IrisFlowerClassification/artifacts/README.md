# Evaluation artifacts

`evaluation.json` holds the notebook's test-set results (schema_version 2): labels, split sizes, and per model the accuracy,
macro metrics, per-class precision/recall/F1/support and confusion matrix. The frontend validates it before display and shows
"Evaluation results not configured" if it is missing or malformed.

Regenerate from the repo root with `python scripts/export_artifacts.py`. It reproduces the notebook split
(`test_size=0.2, random_state=42, stratify=y`) and evaluates the saved `iris_scaler.pkl` + `iris_model.pkl`; the KNN (k=5)
entry is refit exactly as in the notebook. Then copy the file to `frontend/public/evaluation.json`.
