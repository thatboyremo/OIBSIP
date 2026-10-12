"""Regenerates artifacts/evaluation.json and frontend/src/data/iris.json, and verifies the saved files.

Run from the repo root:  python scripts/export_artifacts.py [path/to/IRIS_FLOWER_CLASSIFICATION.ipynb]

- Uses the notebook's split: test_size=0.20, random_state=42, stratify=y.
- Logistic Regression metrics come from the SAVED scaler + SAVED model (backend/models).
- KNN (n_neighbors=5, as in the notebook) was never saved, so it is refit on the same scaled training split.
- Verification refits the notebook's LogisticRegression(max_iter=200) and checks the saved parameters match.
  The refit is used only for comparison; nothing saved is replaced.
"""
import json, re, sys
import joblib, numpy as np, pandas as pd
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

iris = load_iris()
names = list(iris.target_names)
df = pd.DataFrame(iris.data, columns=iris.feature_names)
model = joblib.load("backend/models/iris_model.pkl")
scaler = joblib.load("backend/models/iris_scaler.pkl")
Xtr, Xte, ytr, yte = train_test_split(df, iris.target, test_size=0.2, random_state=42, stratify=iris.target)
Xtr_s, Xte_s = scaler.transform(Xtr), scaler.transform(Xte)
knn = KNeighborsClassifier(n_neighbors=5).fit(Xtr_s, ytr)

# --- verification of the saved files against the notebook configuration ---
ref_scaler = StandardScaler().fit(Xtr)
ref_lr = LogisticRegression(max_iter=200).fit(ref_scaler.transform(Xtr), ytr)
checks = [
    {"check": "Saved scaler mean and scale equal a StandardScaler fit on the 120 training rows", "passed": bool(np.allclose(ref_scaler.mean_, scaler.mean_) and np.allclose(ref_scaler.scale_, scaler.scale_))},
    {"check": "Saved scaler feature order is sepal length, sepal width, petal length, petal width", "passed": list(scaler.feature_names_in_) == list(iris.feature_names)},
    {"check": "Saved model coefficients and intercepts equal a refit LogisticRegression(max_iter=200) on the scaled training split", "passed": bool(np.allclose(ref_lr.coef_, model.coef_) and np.allclose(ref_lr.intercept_, model.intercept_))},
    {"check": "Saved model class order is 0, 1, 2 (setosa, versicolor, virginica)", "passed": [int(c) for c in model.classes_] == [0, 1, 2]},
    {"check": "Saved model supports predict_proba", "passed": hasattr(model, "predict_proba")},
]
if len(sys.argv) > 1:  # optional: compare with the accuracy printed in the notebook
    nb = json.load(open(sys.argv[1]))
    text = "\n".join("".join(o.get("text", [])) for c in nb["cells"] if c["cell_type"] == "code" for o in c.get("outputs", []))
    lr_acc = float(re.search(r"Logistic Regression Accuracy: ([0-9.]+)", text).group(1))
    knn_acc = float(re.search(r"KNN Accuracy: ([0-9.]+)", text).group(1))
else:
    lr_acc = knn_acc = None


def block(name, clf, selected, provenance, notebook_acc):
    p = clf.predict(Xte_s)
    rep = classification_report(yte, p, target_names=names, output_dict=True)
    acc = accuracy_score(yte, p)
    if notebook_acc is not None:
        checks.append({"check": f"{name} accuracy equals the value printed in the notebook ({notebook_acc:.4f})", "passed": abs(acc - notebook_acc) < 1e-9})
    return {"name": name, "selected": selected, "provenance": provenance, "accuracy": acc,
            "macro": {k: rep["macro avg"][k] for k in ("precision", "recall", "f1-score")},
            "per_class": {n: {k: rep[n][k] for k in ("precision", "recall", "f1-score", "support")} for n in names},
            "confusion_matrix": confusion_matrix(yte, p).tolist()}


models = [block("Logistic Regression", model, True, "saved_model", lr_acc),
          block("K-Nearest Neighbours (k=5)", knn, False, "refit_from_notebook_config", knn_acc)]
out = {"schema_version": 2, "source": "Notebook split: test_size=0.2, random_state=42, stratified",
       "labels": names, "train_samples": len(Xtr), "test_samples": len(Xte),
       "test_row_indices": sorted(int(i) for i in Xte.index), "verification": checks, "models": models}
json.dump(out, open("artifacts/evaluation.json", "w"), indent=2)
json.dump(out, open("frontend/public/evaluation.json", "w"), indent=2)
rows = [[round(float(v), 1) for v in r] + [int(t)] for r, t in zip(iris.data, iris.target)]
json.dump({"features": ["sepal_length", "sepal_width", "petal_length", "petal_width"], "species": names, "rows": rows},
          open("frontend/src/data/iris.json", "w"), separators=(",", ":"))
for c in checks:
    print("PASS" if c["passed"] else "FAIL", "-", c["check"])
print([(m["name"], round(m["accuracy"], 4), m["provenance"]) for m in models])
sys.exit(0 if all(c["passed"] for c in checks) else 1)
