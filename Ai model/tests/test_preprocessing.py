from io import BytesIO

import numpy as np
from PIL import Image

from preprocessing import normalize_image, resize_image


def _png_bytes(size=(64, 48)) -> bytes:
    buf = BytesIO()
    Image.new("RGB", size, color=(10, 140, 30)).save(buf, format="PNG")
    return buf.getvalue()


def test_resize_image():
    arr = resize_image(_png_bytes())
    assert arr.shape == (224, 224, 3)
    assert arr.dtype == np.float32
    assert np.isfinite(arr).all()


def test_normalize_image():
    arr = resize_image(_png_bytes())
    batch = normalize_image(arr)
    assert batch.shape == (1, 224, 224, 3)
    assert batch.dtype == np.float32
    assert np.isfinite(batch).all()


def test_normalize_image_batch_dimension():
    small = np.zeros((224, 224, 3), dtype=np.float32)
    batch = normalize_image(small)
    assert batch.ndim == 4
    assert batch.shape[0] == 1
