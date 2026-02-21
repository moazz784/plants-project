using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using LeafScan.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LeafScan.Infrastructure.Services;

public class IrrigationCalculatorService : IIrrigationCalculatorService
{
    private readonly ApplicationDbContext _db;

    public IrrigationCalculatorService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IrrigationCalculatorResponse?> CalculateAsync(string soilType, string climate, string crop, decimal landArea, CancellationToken ct = default)
    {
        var requirement = await _db.CropRequirements
            .AsNoTracking()
            .Include(cr => cr.Crop)
            .Where(cr => cr.Crop.Name.ToLower() == crop.ToLower())
            .FirstOrDefaultAsync(ct);

        if (requirement == null)
            return null;

        var waterLitersPerWeek = landArea * requirement.WaterLitersPerAcrePerWeek;
        var fertilizerKg = landArea * requirement.FertilizerKgPerAcre;

        return new IrrigationCalculatorResponse(waterLitersPerWeek, fertilizerKg);
    }
}
