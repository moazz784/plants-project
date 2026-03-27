using LeafScan.Application.DTOs;

namespace LeafScan.Application.Services;

public interface ICropRecommendationService
{
    Task<CropRecommendationResponse> GetRecommendationsAsync(string soilType, string climate, string lang, CancellationToken ct = default);
}
