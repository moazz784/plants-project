from io import BytesIO

from fastapi.testclient import TestClient
from PIL import Image

from app import app


def _png_bytes() -> bytes:
    buf = BytesIO()
    Image.new("RGB", (48, 48), color=(20, 90, 40)).save(buf, format="PNG")
    return buf.getvalue()


client = TestClient(app)


def test_predict_endpoint():
    data = _png_bytes()
    response = client.post(
        "/predict",
        files={"file": ("leaf.png", data, "image/png")},
    )
    assert response.status_code == 200
    body = response.json()
    assert "predicted_class" in body
    assert "confidence" in body
    assert isinstance(body["top3"], list)


def test_invalid_image_returns_400():
    response = client.post(
        "/predict",
        files={"file": ("notes.txt", b"not an image", "text/plain")},
    )
    assert response.status_code == 400


def test_corrupt_image_returns_400():
    response = client.post(
        "/predict",
        files={"file": ("fake.jpg", b"\xff\xd8notreally", "image/jpeg")},
    )
    assert response.status_code == 400


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "model_loaded": True}
