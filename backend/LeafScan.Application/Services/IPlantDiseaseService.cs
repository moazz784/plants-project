using LeafScan.Application.DTOs;
using Microsoft.AspNetCore.Http;

namespace LeafScan.Application.Services;

public interface IPlantDiseaseService
{
    Task<PredictionResult> PredictAsync(IFormFile image, CancellationToken ct = default);

    Task<PredictionResult> PredictAsync(byte[] imageBytes, string contentType, string fileName, CancellationToken ct = default);

    /// <summary>
    /// Pings the Python model service to wake it up from cold-start.
    /// Returns true if the service is ready, false if still loading.
    /// </summary>
    Task<bool> WarmUpAsync();
}
