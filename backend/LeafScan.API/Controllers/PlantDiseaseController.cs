using LeafScan.Application.Services;
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
