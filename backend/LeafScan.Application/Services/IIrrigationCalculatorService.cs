using LeafScan.Application.DTOs;

namespace LeafScan.Application.Services;

public interface IIrrigationCalculatorService
{
    Task<CalculationResponse?> CalculateAsync(string soilType, string climate, string crop, decimal landArea, CancellationToken ct = default);
}
