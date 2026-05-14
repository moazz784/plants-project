from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
import os
import gdown

from inference import format_prediction
from preprocessing import normalize_image, resize_image

app = FastAPI(title="Plant Disease Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

CLASS_NAMES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy",
]

MODEL_PATH = "best_model_final.keras"
GDRIVE_FILE_ID = os.environ.get("GDRIVE_MODEL_FILE_ID", "")

_SKIP_MODEL = os.environ.get("SKIP_PLANT_MODEL_LOAD", "").lower() in ("1", "true", "yes")


class _StubModel:
    """Deterministic softmax-like output for CI/tests without a .keras file."""

    def predict(self, x, verbose=0):
        n = len(CLASS_NAMES)
        logits = np.arange(n, dtype=np.float32)
        ex = np.exp(logits - np.max(logits))
        probs = ex / np.sum(ex)
        return np.expand_dims(probs, axis=0)


if _SKIP_MODEL:
    print("SKIP_PLANT_MODEL_LOAD: using stub model (tests / no weights file).")
    model = _StubModel()
else:
    if not os.path.exists(MODEL_PATH):
        if not GDRIVE_FILE_ID:
            raise RuntimeError(
                "Model file not found locally and GDRIVE_MODEL_FILE_ID env var is not set."
            )
        print(f"Downloading model from Google Drive (ID: {GDRIVE_FILE_ID})...")
        gdown.download(id=GDRIVE_FILE_ID, output=MODEL_PATH, quiet=False)
        print("Download complete.")

    print("Loading model...")

    import keras.src.layers.core.dense as _keras_dense_mod

    _orig_dense_init = _keras_dense_mod.Dense.__init__

    def _patched_dense_init(self, *args, quantization_config=None, **kwargs):
        _orig_dense_init(self, *args, **kwargs)

    _keras_dense_mod.Dense.__init__ = _patched_dense_init

    model = tf.keras.models.load_model(MODEL_PATH)
    model.predict(np.zeros((1, 224, 224, 3)), verbose=0)
    print("Model loaded and warmed up successfully.")


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": True}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ("image/jpeg", "image/png", "image/webp", "image/bmp"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Upload a JPEG, PNG, or WebP image.",
        )

    contents = await file.read()
    try:
        img_array = resize_image(contents)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Could not read image. Upload a valid JPEG, PNG, or WebP image.",
        ) from None

    img_preprocessed = normalize_image(img_array)
    predictions = model.predict(img_preprocessed, verbose=0)[0]

    return format_prediction(predictions, CLASS_NAMES)
