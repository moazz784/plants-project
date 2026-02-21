using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using LeafScan.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LeafScan.Infrastructure.Services;

public class CropRecommendationService : ICropRecommendationService
{
    private readonly ApplicationDbContext _db;

    public CropRecommendationService(ApplicationDbContext db) => _db = db;

    public async Task<IReadOnlyList<SoilTypeDto>> GetSoilTypesAsync(CancellationToken ct = default)
    {
        return await _db.SoilTypes
            .OrderBy(s => s.Name)
            .Select(s => new SoilTypeDto(s.Id, s.Name))
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<ClimateDto>> GetClimatesAsync(CancellationToken ct = default)
    {
        return await _db.Climates
            .OrderBy(c => c.Name)
            .Select(c => new ClimateDto(c.Id, c.Name))
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<CropDto>> GetCropsAsync(CancellationToken ct = default)
    {
        return await _db.Crops
            .OrderBy(c => c.Name)
            .Select(c => new CropDto(c.Id, c.Name))
            .ToListAsync(ct);
    }

    public async Task<RecommendationResponse> GetRecommendationsAsync(string soilType, string climate, CancellationToken ct = default)
    {
        var cropNames = await _db.CropSoilClimates
            .Where(csc =>
                csc.SoilType.Name.ToLower() == soilType.Trim().ToLower() &&
                csc.Climate.Name.ToLower() == climate.Trim().ToLower())
            .Select(csc => csc.Crop.Name)
            .Distinct()
            .OrderBy(n => n)
            .ToListAsync(ct);

        return new RecommendationResponse(cropNames, soilType.Trim(), climate.Trim());
    }
}
