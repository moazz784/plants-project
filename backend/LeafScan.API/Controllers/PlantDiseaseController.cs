using System.Security.Claims;
using LeafScan.Application.Services;
using LeafScan.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace LeafScan.API.Controllers;

[ApiController]
[Route("api/plant")]
public class PlantDiseaseController : ControllerBase
{
    private readonly IPlantDiseaseService _service;
    private readonly IPredictionPersistenceService _persistence;
    private readonly IScanImageStorageService _scanStorage;
    private readonly ILogger<PlantDiseaseController> _logger;
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

    public PlantDiseaseController(
        IPlantDiseaseService service,
        IPredictionPersistenceService persistence,
        IScanImageStorageService scanStorage,
        ILogger<PlantDiseaseController> logger)
    {
        _service = service;
        _persistence = persistence;
        _scanStorage = scanStorage;
        _logger = logger;
    }

    [HttpPost("predict")]
    public async Task<IActionResult> Predict(IFormFile image)
    {
        if (image == null || image.Length == 0)
            return BadRequest(new { code = "NO_IMAGE", error = "No image provided." });

        if (image.Length > MaxFileSizeBytes)
            return BadRequest(new { code = "FILE_TOO_LARGE", error = "File size exceeds 10 MB limit." });

        var ext = Path.GetExtension(image.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            return BadRequest(new { code = "INVALID_FORMAT", error = "Only JPEG, PNG, and WebP images are accepted." });

        try
        {
            await using var buffer = new MemoryStream();
            await image.CopyToAsync(buffer, HttpContext.RequestAborted);
            var imageBytes = buffer.ToArray();

            var result = await _service.PredictAsync(
                imageBytes,
                image.ContentType ?? string.Empty,
                image.FileName ?? "image.jpg",
                HttpContext.RequestAborted);

            string? scanUrl = null;
            try
            {
                scanUrl = await _scanStorage.TrySaveScanAsync(
                    imageBytes,
                    image.ContentType ?? string.Empty,
                    image.FileName ?? "image.jpg",
                    HttpContext.RequestAborted);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to save scan image to disk.");
            }

            var persisted = false;
            var persistenceThrew = false;
            try
            {
                Guid? userId = null;
                var sub = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (Guid.TryParse(sub, out var parsed))
                    userId = parsed;

                persisted = await _persistence.PersistSuccessfulPredictionAsync(userId, result, scanUrl,
                    HttpContext.RequestAborted);
            }
            catch (Exception ex)
            {
                persistenceThrew = true;
                _logger.LogWarning(ex, "Failed to persist plant prediction for dashboard stats.");
            }

            result.PersistedToDashboard = persisted;
            if (!persisted && !persistenceThrew)
                _logger.LogWarning(
                    "Prediction completed with PersistedToDashboard=false (dashboard totals unchanged). PredictedClass={PredictedClass}",
                    result.PredictedClass);

            return Ok(result);
        }
        catch (ModelWarmingUpException ex)
        {
            // The Hugging Face Space is cold-starting — tell the frontend to retry.
            return StatusCode(503, new
            {
                code = "MODEL_WARMING_UP",
                error = ex.Message,
                retryAfterSeconds = 30
            });
        }
        catch (Exception ex)
        {
            return StatusCode(503, new
            {
                code = "PREDICTION_FAILED",
                error = "Prediction service unavailable.",
                detail = ex.Message
            });
        }
    }

    /// <summary>
    /// Pings the Python ML service to trigger a cold-start wake-up.
    /// Call this when the user opens the scan page so the model is ready by the time they upload.
    /// </summary>
    [HttpGet("warmup")]
    public async Task<IActionResult> WarmUp()
    {
        var ready = await _service.WarmUpAsync();
        return Ok(new { ready, message = ready ? "Model is ready." : "Model is starting up, please wait ~30 seconds." });
    }

    [HttpGet("health")]
    public IActionResult Health() => Ok(new { status = "ok" });
}
