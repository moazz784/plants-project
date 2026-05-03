using LeafScan.Application.DTOs;
using Microsoft.AspNetCore.Http;

namespace LeafScan.Application.Services;

public interface IPlantDiseaseService
{
    Task<PredictionResult> PredictAsync(IFormFile image);
}
