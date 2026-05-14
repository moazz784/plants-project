using LeafScan.Application.Services;
using LeafScan.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace LeafScan.API.Controllers;

[ApiController]
[Route("api/plant")]
public class PlantDiseaseController : ControllerBase
{
    private readonly IPlantDiseaseService _service;
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

    public PlantDiseaseController(IPlantDiseaseService service)
    {
        _service = service;
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
            var result = await _service.PredictAsync(image);
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
