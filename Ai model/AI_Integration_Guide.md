# Plant Disease AI Model — Integration Guide

**For:** React Frontend Developer & ASP.NET Backend Developer  
**Model:** ResNet50 Transfer Learning — Plant Disease Classification  
**Version:** v4 Final  
**Prepared by:** AI Model Team

---

## Table of Contents

1. [Model Overview](#1-model-overview)
2. [Data Flow Architecture](#2-data-flow-architecture)
3. [Step 1 — Export the Model from Colab](#3-step-1--export-the-model-from-colab)
4. [Step 2 — Deploy the Python Prediction API](#4-step-2--deploy-the-python-prediction-api)
5. [Step 3 — ASP.NET Backend Integration](#5-step-3--aspnet-backend-integration)
6. [Step 4 — React Frontend Integration](#6-step-4--react-frontend-integration)
7. [API Contract Reference](#7-api-contract-reference)
8. [Class Names Reference (All 38 Labels)](#8-class-names-reference-all-38-labels)
9. [Quick-Start Checklist](#9-quick-start-checklist)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Model Overview

### What it does
The model takes a photograph of a plant leaf and classifies it into one of **38 categories** — covering diseases and healthy states across 14 plant species. It returns the predicted disease name, confidence percentage, and the top-3 most likely predictions.

### Architecture
| Component | Detail |
|---|---|
| Backbone | ResNet50 pretrained on ImageNet |
| Custom head | GlobalAveragePooling2D → BatchNorm → Dense(512, relu) → Dropout(0.5) → Dense(256, relu) → Dropout(0.3) → Dense(38, softmax) |
| Input shape | `(1, 224, 224, 3)` — batch of 1, RGB image, 224×224 pixels |
| Output shape | `(1, 38)` — array of 38 probabilities summing to 1.0 |
| Preprocessing | ResNet50 `preprocess_input` (BGR mean subtraction — NOT simple /255 normalization) |
| Output format | Softmax probabilities → `argmax` gives predicted class index |
| Saved file | `plant_disease_model.keras` |

### Important preprocessing note
The model was trained with `tensorflow.keras.applications.resnet50.preprocess_input`, not simple `/ 255` normalization. **The Python API handles this automatically** — neither the React frontend nor the ASP.NET backend needs to do any image preprocessing. Just send the raw image bytes.

---

## 2. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                  │
│   [Upload leaf image] ──► React App                             │
│                              │                                  │
│                    FormData POST (multipart/form-data)          │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ASP.NET BACKEND                               │
│                                                                  │
│   POST /api/plant/predict                                       │
│        │  receives IFormFile                                     │
│        │  validates image                                        │
│        │  forwards to Python API                                 │
│        ▼                                                        │
│   PlantDiseaseService.cs ──► HTTP POST to Python API            │
│        │                     (multipart/form-data)               │
│        │  receives JSON result                                   │
│        │  maps to response DTO                                   │
│        ▼                                                        │
│   Returns JSON to React                                         │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    HTTP POST /predict
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PYTHON FASTAPI MICROSERVICE                     │
│                                                                  │
│   POST /predict                                                  │
│        │  reads image bytes                                      │
│        │  PIL.Image → resize to 224×224 → convert RGB           │
│        │  preprocess_input (ResNet50 normalization)             │
│        │  model.predict → softmax array [38]                    │
│        │  argmax → predicted class                               │
│        │  top-3 sorting                                          │
│        ▼                                                        │
│   Returns: { predicted_class, confidence, top3 }               │
└─────────────────────────────────────────────────────────────────┘
```

**Why this 3-layer architecture?**
- The Python microservice is the only component that loads TensorFlow. ASP.NET never touches the model directly.
- The React frontend never knows the Python service exists — it only talks to ASP.NET.
- This allows independent scaling and deployment of each layer.

---

## 3. Step 1 — Export the Model from Colab

After training completes, the model file is already saved automatically.

### Files produced by the notebook
| File | Location in Colab | Description |
|---|---|---|
| `best_model_final.keras` | `/content/` | Best checkpoint from Phase 2 fine-tuning |
| `plant_disease_model.keras` | `/content/` | Final saved model (same as above, explicit save) |
| `training_history.json` | `/content/` | Training metrics per epoch (for reports) |

### How to download the model file

**Option A — Google Drive (recommended, already done by Cell 34):**
The notebook's Cell 34 backs up all files to Google Drive automatically. Find `best_model_final.keras` at the root of your Google Drive.

**Option B — Direct download from Colab:**
Run this in a new Colab cell:
```python
from google.colab import files
files.download('best_model_final.keras')
```

### Model file size
Approximately **100 MB** (ResNet50 weights + custom head). Keep this in mind for server storage and deployment pipelines.

---

## 4. Step 2 — Deploy the Python Prediction API

The Python API is a lightweight FastAPI service that loads the model once at startup and serves predictions over HTTP.

### Requirements

Create a `requirements.txt`:
```
fastapi==0.110.0
uvicorn==0.29.0
tensorflow==2.16.1
pillow==10.3.0
numpy==1.26.4
python-multipart==0.0.9
```

### API server code

Create `app.py` in the same folder as `best_model_final.keras`:

```python
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import preprocess_input
from PIL import Image
import numpy as np
import io

app = FastAPI(title="Plant Disease Prediction API")

# Allow ASP.NET backend to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Class labels — must match the training order (alphabetical sort of dataset folders)
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

# Load model once at startup — not on every request
print("Loading model...")
model = tf.keras.models.load_model("best_model_final.keras")
print("Model loaded successfully.")


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": True}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Validate file type
    if file.content_type not in ("image/jpeg", "image/png", "image/webp", "image/bmp"):
        raise HTTPException(status_code=400, detail="Invalid file type. Upload a JPEG or PNG image.")

    # Read and preprocess image
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB").resize((224, 224))
    img_array = np.array(img, dtype=np.float32)
    img_preprocessed = preprocess_input(img_array.copy())          # ResNet50 normalization
    img_preprocessed = np.expand_dims(img_preprocessed, axis=0)    # add batch dimension

    # Run prediction
    predictions = model.predict(img_preprocessed, verbose=0)[0]    # shape: (38,)

    predicted_index = int(np.argmax(predictions))
    predicted_class = CLASS_NAMES[predicted_index]
    confidence = float(np.max(predictions)) * 100

    # Build top-3
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
```

### Run the server

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

### Test it manually (before connecting ASP.NET)

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -F "file=@/path/to/leaf.jpg"
```

Expected response:
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

### Production deployment options
- **Docker** (recommended): containerize the Python service with the model file bundled.
- **Azure Container Apps** / **Google Cloud Run**: deploy the Docker image.
- **Same server as ASP.NET**: run the Python service on a different port (e.g., 8000) alongside ASP.NET.

---

## 5. Step 3 — ASP.NET Backend Integration

The ASP.NET backend acts as a proxy: it receives the image from React, forwards it to the Python API, and returns the structured result.

### Project structure additions
```
Controllers/
  PlantDiseaseController.cs
Services/
  IPlantDiseaseService.cs
  PlantDiseaseService.cs
Models/
  PredictionResult.cs
  Top3Item.cs
```

### Models

```csharp
// Models/Top3Item.cs
public class Top3Item
{
    public string Class { get; set; } = string.Empty;
    public double Confidence { get; set; }
}

// Models/PredictionResult.cs
public class PredictionResult
{
    public string PredictedClass { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public List<Top3Item> Top3 { get; set; } = new();
}
```

### Service interface

```csharp
// Services/IPlantDiseaseService.cs
public interface IPlantDiseaseService
{
    Task<PredictionResult> PredictAsync(IFormFile image);
}
```

### Service implementation

```csharp
// Services/PlantDiseaseService.cs
using System.Net.Http.Headers;
using System.Text.Json;

public class PlantDiseaseService : IPlantDiseaseService
{
    private readonly HttpClient _httpClient;
    private readonly string _pythonApiUrl;

    public PlantDiseaseService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        // Set this in appsettings.json: "PythonApi": { "BaseUrl": "http://localhost:8000" }
        _pythonApiUrl = config["PythonApi:BaseUrl"] ?? "http://localhost:8000";
    }

    public async Task<PredictionResult> PredictAsync(IFormFile image)
    {
        using var content = new MultipartFormDataContent();
        using var stream = image.OpenReadStream();
        var fileContent = new StreamContent(stream);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue(image.ContentType);
        content.Add(fileContent, "file", image.FileName);

        var response = await _httpClient.PostAsync($"{_pythonApiUrl}/predict", content);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception($"Python API error {response.StatusCode}: {error}");
        }

        var json = await response.Content.ReadAsStringAsync();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var result = JsonSerializer.Deserialize<PredictionResult>(json, options);
        return result ?? throw new Exception("Empty response from prediction service.");
    }
}
```

### Controller

```csharp
// Controllers/PlantDiseaseController.cs
[ApiController]
[Route("api/plant")]
public class PlantDiseaseController : ControllerBase
{
    private readonly IPlantDiseaseService _service;
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

    public PlantDiseaseController(IPlantDiseaseService service)
    {
        _service = service;
    }

    [HttpPost("predict")]
    public async Task<IActionResult> Predict(IFormFile image)
    {
        if (image == null || image.Length == 0)
            return BadRequest(new { error = "No image provided." });

        if (image.Length > MaxFileSizeBytes)
            return BadRequest(new { error = "File size exceeds 10 MB limit." });

        var ext = Path.GetExtension(image.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            return BadRequest(new { error = "Only JPEG, PNG, and WebP images are accepted." });

        try
        {
            var result = await _service.PredictAsync(image);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(503, new { error = "Prediction service unavailable.", detail = ex.Message });
        }
    }

    [HttpGet("health")]
    public IActionResult Health() => Ok(new { status = "ok" });
}
```

### Register in Program.cs

```csharp
// Program.cs
builder.Services.AddHttpClient<IPlantDiseaseService, PlantDiseaseService>();
```

### appsettings.json

```json
{
  "PythonApi": {
    "BaseUrl": "http://localhost:8000"
  }
}
```

> For production, replace `http://localhost:8000` with the deployed Python API URL (e.g., `https://plant-api.yourdomain.com`).

---

## 6. Step 4 — React Frontend Integration

### What React sends
A `POST` request to `https://yourbackend.com/api/plant/predict` with `multipart/form-data` containing the image file.

**React does NOT need to:**
- Resize the image
- Normalize pixel values
- Convert to any specific format

All preprocessing is handled by the Python API.

### Upload + Predict component

```jsx
// components/PlantDiseasePredictor.jsx
import { useState } from 'react';

export default function PlantDiseasePredictor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);   // key must match IFormFile parameter name in C#

    try {
      const response = await fetch('/api/plant/predict', {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type header — browser sets it automatically with boundary
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Prediction failed.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Plant Disease Detection</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={!file || loading}>
          {loading ? 'Analyzing...' : 'Predict Disease'}
        </button>
      </form>

      {preview && <img src={preview} alt="Leaf preview" style={{ maxWidth: 300 }} />}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {result && (
        <div>
          <h3>Result</h3>
          <p><strong>Predicted:</strong> {result.predictedClass}</p>
          <p><strong>Confidence:</strong> {result.confidence.toFixed(1)}%</p>

          {/* Confidence bar */}
          <div style={{ background: '#eee', borderRadius: 4, height: 12, width: 300 }}>
            <div
              style={{
                background: result.confidence > 80 ? '#4caf50' : '#ff9800',
                width: `${result.confidence}%`,
                height: '100%',
                borderRadius: 4,
              }}
            />
          </div>

          <h4>Top 3 Predictions</h4>
          <ol>
            {result.top3.map((item, i) => (
              <li key={i}>
                {item.class.replace(/_/g, ' ')} — {item.confidence.toFixed(1)}%
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
```

### Display-friendly class name formatting

The raw class names from the model look like `Tomato___Late_blight`. For the UI, apply this transform:

```js
function formatClassName(rawName) {
  // "Tomato___Late_blight" → "Tomato — Late Blight"
  const [plant, disease] = rawName.split('___');
  const plantLabel = plant.replace(/_/g, ' ').replace(/\(.*?\)/g, '').trim();
  const diseaseLabel = disease
    ? disease.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : '';
  return diseaseLabel ? `${plantLabel} — ${diseaseLabel}` : plantLabel;
}
```

Usage: `formatClassName(result.predictedClass)` → `"Tomato — Late Blight"`

---

## 7. API Contract Reference

### POST `/api/plant/predict` (ASP.NET endpoint — called by React)

**Request**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body field: `image` (file) — JPEG, PNG, or WebP, max 10 MB

**Response 200 OK**
```json
{
  "predictedClass": "Tomato___Late_blight",
  "confidence": 94.72,
  "top3": [
    { "class": "Tomato___Late_blight", "confidence": 94.72 },
    { "class": "Tomato___Early_blight", "confidence": 3.21 },
    { "class": "Potato___Late_blight", "confidence": 1.54 }
  ]
}
```

**Response 400 Bad Request**
```json
{ "error": "No image provided." }
{ "error": "File size exceeds 10 MB limit." }
{ "error": "Only JPEG, PNG, and WebP images are accepted." }
```

**Response 503 Service Unavailable**
```json
{ "error": "Prediction service unavailable.", "detail": "..." }
```

---

### POST `/predict` (Python FastAPI endpoint — called by ASP.NET only)

**Request**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body field: `file` (file)

**Response 200 OK**
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

**GET `/health`** — returns `{ "status": "ok", "model_loaded": true }`. Use this for uptime monitoring.

---

## 8. Class Names Reference (All 38 Labels)

These are the exact strings the model outputs in `predicted_class`. Index order matches the sorted alphabetical order of the dataset folders.

| Index | Raw Label | Plant | Condition |
|---|---|---|---|
| 0 | `Apple___Apple_scab` | Apple | Apple Scab |
| 1 | `Apple___Black_rot` | Apple | Black Rot |
| 2 | `Apple___Cedar_apple_rust` | Apple | Cedar Apple Rust |
| 3 | `Apple___healthy` | Apple | Healthy |
| 4 | `Blueberry___healthy` | Blueberry | Healthy |
| 5 | `Cherry_(including_sour)___Powdery_mildew` | Cherry | Powdery Mildew |
| 6 | `Cherry_(including_sour)___healthy` | Cherry | Healthy |
| 7 | `Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot` | Corn | Cercospora / Gray Leaf Spot |
| 8 | `Corn_(maize)___Common_rust_` | Corn | Common Rust |
| 9 | `Corn_(maize)___Northern_Leaf_Blight` | Corn | Northern Leaf Blight |
| 10 | `Corn_(maize)___healthy` | Corn | Healthy |
| 11 | `Grape___Black_rot` | Grape | Black Rot |
| 12 | `Grape___Esca_(Black_Measles)` | Grape | Esca (Black Measles) |
| 13 | `Grape___Leaf_blight_(Isariopsis_Leaf_Spot)` | Grape | Leaf Blight |
| 14 | `Grape___healthy` | Grape | Healthy |
| 15 | `Orange___Haunglongbing_(Citrus_greening)` | Orange | Citrus Greening |
| 16 | `Peach___Bacterial_spot` | Peach | Bacterial Spot |
| 17 | `Peach___healthy` | Peach | Healthy |
| 18 | `Pepper,_bell___Bacterial_spot` | Bell Pepper | Bacterial Spot |
| 19 | `Pepper,_bell___healthy` | Bell Pepper | Healthy |
| 20 | `Potato___Early_blight` | Potato | Early Blight |
| 21 | `Potato___Late_blight` | Potato | Late Blight |
| 22 | `Potato___healthy` | Potato | Healthy |
| 23 | `Raspberry___healthy` | Raspberry | Healthy |
| 24 | `Soybean___healthy` | Soybean | Healthy |
| 25 | `Squash___Powdery_mildew` | Squash | Powdery Mildew |
| 26 | `Strawberry___Leaf_scorch` | Strawberry | Leaf Scorch |
| 27 | `Strawberry___healthy` | Strawberry | Healthy |
| 28 | `Tomato___Bacterial_spot` | Tomato | Bacterial Spot |
| 29 | `Tomato___Early_blight` | Tomato | Early Blight |
| 30 | `Tomato___Late_blight` | Tomato | Late Blight |
| 31 | `Tomato___Leaf_Mold` | Tomato | Leaf Mold |
| 32 | `Tomato___Septoria_leaf_spot` | Tomato | Septoria Leaf Spot |
| 33 | `Tomato___Spider_mites Two-spotted_spider_mite` | Tomato | Spider Mites |
| 34 | `Tomato___Target_Spot` | Tomato | Target Spot |
| 35 | `Tomato___Tomato_Yellow_Leaf_Curl_Virus` | Tomato | Yellow Leaf Curl Virus |
| 36 | `Tomato___Tomato_mosaic_virus` | Tomato | Mosaic Virus |
| 37 | `Tomato___healthy` | Tomato | Healthy |

**14 plant species total:** Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato.

---

## 9. Quick-Start Checklist

### AI / Model Team
- [ ] Training completed, model saved as `best_model_final.keras`
- [ ] Model file downloaded from Colab / Google Drive
- [ ] Python FastAPI service (`app.py`) created with model file in same folder
- [ ] `pip install -r requirements.txt` run successfully
- [ ] `uvicorn app:app --host 0.0.0.0 --port 8000` starts without error
- [ ] `GET http://localhost:8000/health` returns `{ "status": "ok" }`
- [ ] `POST http://localhost:8000/predict` tested with a sample leaf image
- [ ] Python service URL shared with backend developer

### ASP.NET Backend Developer
- [ ] Python API URL added to `appsettings.json` under `PythonApi:BaseUrl`
- [ ] `PredictionResult.cs`, `Top3Item.cs` models created
- [ ] `PlantDiseaseService.cs` + `IPlantDiseaseService.cs` created
- [ ] `AddHttpClient<IPlantDiseaseService, PlantDiseaseService>()` registered in `Program.cs`
- [ ] `PlantDiseaseController.cs` created with `POST /api/plant/predict`
- [ ] Controller tested with Postman: send a JPEG via `form-data` with key `image`
- [ ] CORS policy configured to allow React dev origin (`http://localhost:3000`)
- [ ] Error handling tested: oversized file, wrong file type, Python API down

### React Frontend Developer
- [ ] `PlantDiseasePredictor` component created
- [ ] File input restricted to `image/jpeg,image/png,image/webp`
- [ ] `FormData` built with key `image` matching the ASP.NET controller parameter
- [ ] `Content-Type` header NOT manually set (browser handles multipart boundary)
- [ ] `result.predictedClass` displayed using `formatClassName()` helper
- [ ] Confidence bar rendered
- [ ] Top-3 list rendered
- [ ] Loading state shown during fetch
- [ ] Error messages shown for 400/503 responses
- [ ] Tested end-to-end with a real leaf photo

---

## 10. Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| Python API returns 500 on any image | Model not loaded / wrong path | Check that `best_model_final.keras` is in the same directory as `app.py`; check startup logs for load errors |
| Predictions are always wrong / very low confidence | Wrong preprocessing | Make sure you are using `preprocess_input` in the Python API, not `/ 255` |
| ASP.NET returns 503 | Python service not running or wrong URL | Confirm `uvicorn` is running; verify `PythonApi:BaseUrl` in `appsettings.json` |
| React gets CORS error from ASP.NET | CORS not configured | Add `app.UseCors(...)` in ASP.NET `Program.cs` allowing the React dev origin |
| React gets 400 "No image provided" | Wrong `FormData` key | Key in `formData.append(...)` must be `'image'` (matches `IFormFile image` parameter name in C#) |
| `Content-Type` boundary error in ASP.NET | React manually set `Content-Type` header | Remove the `Content-Type` header from the `fetch` call — let the browser set it automatically |
| Model loads but prediction is very slow on first call | TF warmup | Add a warmup call at Python startup: `model.predict(np.zeros((1,224,224,3)))` after loading |
| Class index out of range | `CLASS_NAMES` list is wrong length | Confirm 38 entries in the Python `CLASS_NAMES` list match the table in Section 8 |
