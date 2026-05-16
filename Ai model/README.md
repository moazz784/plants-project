---
title: Plant Disease API
emoji: 🌿
colorFrom: green
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

# Plant Disease Prediction API

FastAPI service for ResNet50-based plant disease classification (38 classes, 14 plant species).

## Endpoints

- `GET /health` — liveness check, returns `{"status": "ok", "model_loaded": true}`
- `POST /predict` — upload a leaf image (JPEG/PNG/WebP), returns `predicted_class`, `confidence`, `top3`

## Environment Variables

| Variable | Description |
|---|---|
| `GDRIVE_MODEL_FILE_ID` | Google Drive file ID for `best_model_final.keras` (~100 MB). Set this as a Space Secret. |

## Example response

```json
{
  "predicted_class": "Tomato___Late_blight",
  "confidence": 94.72,
  "top3": [
    { "class": "Tomato___Late_blight", "confidence": 94.72 },
    { "class": "Tomato___Early_blight", "confidence": 3.21 },
    { "class": "Potato___Late_blight", "confidence": 1.54 }
  ]
}
```
