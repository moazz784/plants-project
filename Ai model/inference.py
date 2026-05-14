"""Turn raw model outputs into API response fields."""

from __future__ import annotations

from typing import Any

import numpy as np


def format_prediction(predictions: np.ndarray, class_names: list[str]) -> dict[str, Any]:
    """Build JSON-serializable prediction dict from a single (num_classes,) softmax vector."""
    predicted_index = int(np.argmax(predictions))
    predicted_class = class_names[predicted_index]
    confidence = float(np.max(predictions)) * 100

    top3_indices = np.argsort(predictions)[::-1][:3]
    top3 = [
        {"class": class_names[i], "confidence": round(float(predictions[i]) * 100, 2)}
        for i in top3_indices
    ]

    return {
        "predicted_class": predicted_class,
        "confidence": round(confidence, 2),
        "top3": top3,
    }
