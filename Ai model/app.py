from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import preprocess_input
from PIL import Image
import numpy as np
import io
import os
import gdown

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

if not os.path.exists(MODEL_PATH):
    if not GDRIVE_FILE_ID:
        raise RuntimeError(
            "Model file not found locally and GDRIVE_MODEL_FILE_ID env var is not set."
        )
    print(f"Downloading model from Google Drive (ID: {GDRIVE_FILE_ID})...")
    gdown.download(id=GDRIVE_FILE_ID, output=MODEL_PATH, quiet=False)
    print("Download complete.")

print("Loading model...")
model = tf.keras.models.load_model(MODEL_PATH)
# Warmup call to avoid slow first prediction request
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
    img = Image.open(io.BytesIO(contents)).convert("RGB").resize((224, 224))
    img_array = np.array(img, dtype=np.float32)
    img_preprocessed = preprocess_input(img_array.copy())
    img_preprocessed = np.expand_dims(img_preprocessed, axis=0)

    predictions = model.predict(img_preprocessed, verbose=0)[0]

    predicted_index = int(np.argmax(predictions))
    predicted_class = CLASS_NAMES[predicted_index]
    confidence = float(np.max(predictions)) * 100

    top3_indices = np.argsort(predictions)[::-1][:3]
    top3 = [
        {"class": CLASS_NAMES[i], "confidence": round(float(predictions[i]) * 100, 2)}
        for i in top3_indices
    ]

    return {
        "predicted_class": predicted_class,
        "confidence": round(confidence, 2),
        "top3": top3,
    }
