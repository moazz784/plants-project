using LeafScan.Application.DTOs;

namespace LeafScan.Application.Services;

public interface ICropRecommendationService
{
    Task<IReadOnlyList<SoilTypeDto>> GetSoilTypesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<ClimateDto>> GetClimatesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<CropDto>> GetCropsAsync(CancellationToken ct = default);
    Task<RecommendationResponse> GetRecommendationsAsync(string soilType, string climate, CancellationToken ct = default);
}
