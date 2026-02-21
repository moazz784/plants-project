using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using LeafScan.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LeafScan.Infrastructure.Services;

public class IrrigationCalculatorService : IIrrigationCalculatorService
{
    private readonly ApplicationDbContext _db;

    public IrrigationCalculatorService(ApplicationDbContext db) => _db = db;

    public async Task<CalculationResponse?> CalculateAsync(string soilType, string climate, string crop, decimal landArea, CancellationToken ct = default)
    {
        var req = await _db.CropRequirements
            .Include(cr => cr.Crop)
            .Where(cr => cr.Crop.Name.ToLower() == crop.Trim().ToLower())
            .FirstOrDefaultAsync(ct);

        if (req == null) return null;

        var waterLitersPerWeek = landArea * req.WaterLitersPerAcrePerWeek;
        var fertilizerKg = landArea * req.FertilizerKgPerAcre;

        return new CalculationResponse(waterLitersPerWeek, fertilizerKg);
    }
}
