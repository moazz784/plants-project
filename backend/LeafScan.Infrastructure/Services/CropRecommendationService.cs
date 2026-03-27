using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using LeafScan.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LeafScan.Infrastructure.Services;

public class CropRecommendationService : ICropRecommendationService
{
    private readonly ApplicationDbContext _db;

    public CropRecommendationService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<CropRecommendationResponse> GetRecommendationsAsync(string soilType, string climate, string lang, CancellationToken ct = default)
    {
        var soilTypeId = await ResolveSoilTypeIdAsync(soilType, lang, ct);
        var climateId = await ResolveClimateIdAsync(climate, lang, ct);

        if (soilTypeId == null || climateId == null)
            return new CropRecommendationResponse(Array.Empty<string>(), soilType, climate);

        var cropIds = await _db.CropSoilClimates
            .AsNoTracking()
            .Where(csc => csc.SoilTypeId == soilTypeId && csc.ClimateId == climateId)
            .Select(csc => csc.CropId)
            .Distinct()
            .ToArrayAsync(ct);

        var cropNames = await _db.CropTranslations
            .AsNoTracking()
            .Where(t => t.LanguageCode == lang && cropIds.Contains(t.CropId))
            .OrderBy(t => t.Name)
            .Select(t => t.Name)
            .ToArrayAsync(ct);

        if (cropNames.Length == 0)
        {
            cropNames = await _db.Crops
                .AsNoTracking()
                .Where(c => cropIds.Contains(c.Id))
                .OrderBy(c => c.Name)
                .Select(c => c.Name)
                .ToArrayAsync(ct);
        }

        return new CropRecommendationResponse(cropNames, soilType, climate);
    }

    private async Task<int?> ResolveSoilTypeIdAsync(string name, string lang, CancellationToken ct)
    {
        var id = await _db.SoilTypeTranslations
            .AsNoTracking()
            .Where(t => t.LanguageCode == lang && t.Name.ToLower() == name.Trim().ToLower())
            .Select(t => (int?)t.SoilTypeId)
            .FirstOrDefaultAsync(ct);
        if (id != null) return id;
        return await _db.SoilTypes
            .AsNoTracking()
            .Where(s => s.Name.ToLower() == name.Trim().ToLower())
            .Select(s => (int?)s.Id)
            .FirstOrDefaultAsync(ct);
    }

    private async Task<int?> ResolveClimateIdAsync(string name, string lang, CancellationToken ct)
    {
        var id = await _db.ClimateTranslations
            .AsNoTracking()
            .Where(t => t.LanguageCode == lang && t.Name.ToLower() == name.Trim().ToLower())
            .Select(t => (int?)t.ClimateId)
            .FirstOrDefaultAsync(ct);
        if (id != null) return id;
        return await _db.Climates
            .AsNoTracking()
            .Where(c => c.Name.ToLower() == name.Trim().ToLower())
            .Select(c => (int?)c.Id)
            .FirstOrDefaultAsync(ct);
    }
}
