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

    public async Task<CropRecommendationResponse> GetRecommendationsAsync(string soilType, string climate, CancellationToken ct = default)
    {
        var cropNames = await _db.CropSoilClimates
            .AsNoTracking()
            .Where(csc =>
                csc.SoilType.Name.ToLower() == soilType.ToLower() &&
                csc.Climate.Name.ToLower() == climate.ToLower())
            .Include(csc => csc.Crop)
            .Include(csc => csc.SoilType)
            .Include(csc => csc.Climate)
            .Select(csc => csc.Crop.Name)
            .Distinct()
            .OrderBy(n => n)
            .ToArrayAsync(ct);

        return new CropRecommendationResponse(cropNames, soilType, climate);
    }
}
