using LeafScan.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace LeafScan.API.Controllers;

[ApiController]
[Route("api/services")]
public class CropServicesController : ControllerBase
{
    private readonly ICropRecommendationService _recommendationService;
    private readonly IIrrigationCalculatorService _calculatorService;

    public CropServicesController(
        ICropRecommendationService recommendationService,
        IIrrigationCalculatorService calculatorService)
    {
        _recommendationService = recommendationService;
        _calculatorService = calculatorService;
    }

    [HttpGet("soil-types")]
    public async Task<IActionResult> GetSoilTypes(CancellationToken ct)
    {
        var result = await _recommendationService.GetSoilTypesAsync(ct);
        return Ok(result);
    }

    [HttpGet("climates")]
    public async Task<IActionResult> GetClimates(CancellationToken ct)
    {
        var result = await _recommendationService.GetClimatesAsync(ct);
        return Ok(result);
    }

    [HttpGet("crops")]
    public async Task<IActionResult> GetCrops(CancellationToken ct)
    {
        var result = await _recommendationService.GetCropsAsync(ct);
        return Ok(result);
    }

    [HttpGet("recommendations")]
    public async Task<IActionResult> GetRecommendations(
        [FromQuery] string soilType,
        [FromQuery] string climate,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(soilType) || string.IsNullOrWhiteSpace(climate))
            return BadRequest(new { code = "MISSING_PARAMS", message = "soilType and climate are required" });

        var result = await _recommendationService.GetRecommendationsAsync(soilType, climate, ct);
        return Ok(result);
    }

    [HttpGet("calculate")]
    public async Task<IActionResult> Calculate(
        [FromQuery] string soilType,
        [FromQuery] string climate,
        [FromQuery] string crop,
        [FromQuery] decimal landArea,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(crop))
            return BadRequest(new { code = "MISSING_PARAMS", message = "crop is required" });

        if (landArea <= 0)
            return BadRequest(new { code = "INVALID_LAND_AREA", message = "landArea must be greater than 0" });

        var result = await _calculatorService.CalculateAsync(soilType, climate, crop, landArea, ct);
        if (result == null)
            return NotFound(new { code = "CROP_NOT_FOUND", message = "Crop not found or has no requirements data" });

        return Ok(result);
    }
}
