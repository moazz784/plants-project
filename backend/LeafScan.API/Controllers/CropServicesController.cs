using LeafScan.Application.Services;
using LeafScan.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeafScan.API.Controllers;

[ApiController]
[Route("api/services")]
public class CropServicesController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly ICropRecommendationService _recommendationService;
    private readonly IIrrigationCalculatorService _calculatorService;

    public CropServicesController(
        ApplicationDbContext db,
        ICropRecommendationService recommendationService,
        IIrrigationCalculatorService calculatorService)
    {
        _db = db;
        _recommendationService = recommendationService;
        _calculatorService = calculatorService;
    }

    [HttpGet("soil-types")]
    public async Task<IActionResult> GetSoilTypes(CancellationToken ct)
    {
        var items = await _db.SoilTypes.AsNoTracking().OrderBy(s => s.Name).Select(s => s.Name).ToArrayAsync(ct);
        return Ok(items);
    }

    [HttpGet("climates")]
    public async Task<IActionResult> GetClimates(CancellationToken ct)
    {
        var items = await _db.Climates.AsNoTracking().OrderBy(c => c.Name).Select(c => c.Name).ToArrayAsync(ct);
        return Ok(items);
    }

    [HttpGet("crops")]
    public async Task<IActionResult> GetCrops(CancellationToken ct)
    {
        var items = await _db.Crops.AsNoTracking().OrderBy(c => c.Name).Select(c => c.Name).ToArrayAsync(ct);
        return Ok(items);
    }

    [HttpGet("recommendations")]
    public async Task<IActionResult> GetRecommendations(
        [FromQuery] string soilType,
        [FromQuery] string climate,
        CancellationToken ct)
    {
        var response = await _recommendationService.GetRecommendationsAsync(soilType, climate, ct);
        return Ok(response);
    }

    [HttpGet("calculate")]
    public async Task<IActionResult> Calculate(
        [FromQuery] string soilType,
        [FromQuery] string climate,
        [FromQuery] string crop,
        [FromQuery] decimal landArea,
        CancellationToken ct)
    {
        var response = await _calculatorService.CalculateAsync(soilType, climate, crop, landArea, ct);
        if (response == null)
            return NotFound(new { code = "CROP_NOT_FOUND", message = "Crop not found or has no irrigation data" });
        return Ok(response);
    }
}
