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

    public async Task<IrrigationCalculatorResponse?> CalculateAsync(string soilType, string climate, string crop, decimal landArea, string lang, CancellationToken ct = default)
    {
        var cropId = await ResolveCropIdAsync(crop, lang, ct);
        if (cropId == null)
            return null;

        var requirement = await _db.CropRequirements
            .AsNoTracking()
            .Where(cr => cr.CropId == cropId)
            .FirstOrDefaultAsync(ct);

        if (requirement == null)
            return null;

        var waterLitersPerWeek = landArea * requirement.WaterLitersPerAcrePerWeek;
        var fertilizerKg = landArea * requirement.FertilizerKgPerAcre;

        return new IrrigationCalculatorResponse(waterLitersPerWeek, fertilizerKg);
    }

    private async Task<int?> ResolveCropIdAsync(string name, string lang, CancellationToken ct)
    {
        var id = await _db.CropTranslations
            .AsNoTracking()
            .Where(t => t.LanguageCode == lang && t.Name.ToLower() == name.Trim().ToLower())
            .Select(t => (int?)t.CropId)
            .FirstOrDefaultAsync(ct);
        if (id != null) return id;
        return await _db.Crops
            .AsNoTracking()
            .Where(c => c.Name.ToLower() == name.Trim().ToLower())
            .Select(c => (int?)c.Id)
            .FirstOrDefaultAsync(ct);
    }
}
