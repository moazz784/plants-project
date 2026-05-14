"""Image preprocessing for the plant disease model (ResNet50-style)."""

from __future__ import annotations

import io

import numpy as np
from PIL import Image
from tensorflow.keras.applications.resnet50 import preprocess_input


def resize_image(contents: bytes) -> np.ndarray:
    """Decode bytes to RGB float32 array of shape (224, 224, 3)."""
    img = Image.open(io.BytesIO(contents)).convert("RGB").resize((224, 224))
    return np.array(img, dtype=np.float32)


def normalize_image(img_array: np.ndarray) -> np.ndarray:
    """Apply ResNet50 preprocess_input and add batch dimension (1, 224, 224, 3)."""
    preprocessed = preprocess_input(img_array.copy())
    return np.expand_dims(preprocessed, axis=0)
