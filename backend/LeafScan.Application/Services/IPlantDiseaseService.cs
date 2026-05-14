using LeafScan.Application.DTOs;
using Microsoft.AspNetCore.Http;

namespace LeafScan.Application.Services;

public interface IPlantDiseaseService
{
    Task<PredictionResult> PredictAsync(IFormFile image);

    /// <summary>
    /// Pings the Python model service to wake it up from cold-start.
    /// Returns true if the service is ready, false if still loading.
    /// </summary>
    Task<bool> WarmUpAsync();
}
