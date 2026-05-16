import numpy as np

from app import CLASS_NAMES, model
from inference import format_prediction


def test_model_loads():
    assert model is not None
    assert hasattr(model, "predict")
    out = model.predict(np.zeros((1, 224, 224, 3), dtype=np.float32), verbose=0)
    assert out.shape == (1, len(CLASS_NAMES))


def test_confidence_score_range():
    preds = model.predict(np.ones((1, 224, 224, 3), dtype=np.float32), verbose=0)[0]
    payload = format_prediction(preds, CLASS_NAMES)
    conf = payload["confidence"]
    assert 0.0 <= conf <= 100.0


def test_format_prediction_softmax_vector_sums():
    preds = model.predict(np.zeros((1, 224, 224, 3), dtype=np.float32), verbose=0)[0]
    assert abs(float(np.sum(preds)) - 1.0) < 1e-5


def test_top3_has_three_entries():
    preds = model.predict(np.zeros((1, 224, 224, 3), dtype=np.float32), verbose=0)[0]
    payload = format_prediction(preds, CLASS_NAMES)
    assert len(payload["top3"]) == 3


def test_predicted_class_is_known_label():
    preds = model.predict(np.zeros((1, 224, 224, 3), dtype=np.float32), verbose=0)[0]
    payload = format_prediction(preds, CLASS_NAMES)
    assert payload["predicted_class"] in CLASS_NAMES
