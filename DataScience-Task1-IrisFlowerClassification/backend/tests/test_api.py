import joblib, pandas as pd, pytest
from fastapi.testclient import TestClient
from app.main import create_app
from app.services.model_service import FEATURES, SPECIES

MODELS = "models"
client = TestClient(create_app(MODELS))
OK = {"sepal_length": 5.1, "sepal_width": 3.5, "petal_length": 1.4, "petal_width": 0.2}


def test_health_reflects_loaded_model():
    r = client.get("/api/v1/health").json()
    assert r["status"] == "ok" and r["model_loaded"] and r["scaler_loaded"]


def test_missing_files_give_honest_state(tmp_path):
    c = TestClient(create_app(str(tmp_path)))
    assert c.get("/api/v1/health").json()["status"] == "degraded"
    assert c.post("/api/v1/predict", json=OK).status_code == 503


def test_prediction_shape_and_probabilities():
    r = client.post("/api/v1/predict", json=OK).json()
    assert r["prediction"] in SPECIES and r["prediction_index"] == SPECIES.index(r["prediction"])
    assert abs(sum(r["probabilities"].values()) - 1) < 1e-6
    assert all(0 <= p <= 1 for p in r["probabilities"].values())


def test_matches_direct_use_of_saved_files():
    m, s = joblib.load(f"{MODELS}/iris_model.pkl"), joblib.load(f"{MODELS}/iris_scaler.pkl")
    for row in ([5.1, 3.5, 1.4, 0.2], [6.0, 2.9, 4.5, 1.5], [6.5, 3.0, 5.5, 2.0]):
        x = s.transform(pd.DataFrame([row], columns=FEATURES))
        body = dict(zip(OK, row))
        got = client.post("/api/v1/predict", json=body).json()
        assert got["prediction_index"] == int(m.predict(x)[0])
        assert got["probabilities"]["virginica"] == pytest.approx(float(m.predict_proba(x)[0][2]))


def test_feature_order_is_preserved():
    a = client.post("/api/v1/predict", json={**OK, "petal_length": 5.5, "petal_width": 2.0}).json()
    b = client.post("/api/v1/predict", json={**OK, "sepal_length": 5.5, "sepal_width": 2.0}).json()
    assert a["prediction"] != b["prediction"] or a["probabilities"] != b["probabilities"]


@pytest.mark.parametrize("bad", [
    {**OK, "sepal_length": "abc"}, {**OK, "sepal_length": -1}, {**OK, "petal_width": 99},
    {k: v for k, v in OK.items() if k != "petal_width"}, {**OK, "extra": 1},
])
def test_invalid_input_rejected(bad):
    assert client.post("/api/v1/predict", json=bad).status_code == 422


def test_non_finite_rejected():
    r = client.post("/api/v1/predict", content='{"sepal_length": NaN, "sepal_width":3,"petal_length":1,"petal_width":1}',
                    headers={"Content-Type": "application/json"})
    assert r.status_code == 422


def test_cors_allows_configured_origin_only():
    ok = client.options("/api/v1/predict", headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "POST"})
    assert ok.headers.get("access-control-allow-origin") == "http://localhost:5173"
    bad = client.options("/api/v1/predict", headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "POST"})
    assert "access-control-allow-origin" not in bad.headers


def test_validation_error_does_not_leak_internals():
    r = client.post("/api/v1/predict", json={**OK, "sepal_length": -1})
    assert r.status_code == 422 and "Traceback" not in r.text and "models" not in r.text
