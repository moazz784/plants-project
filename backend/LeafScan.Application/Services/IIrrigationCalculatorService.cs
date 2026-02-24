using LeafScan.Application.DTOs;

namespace LeafScan.Application.Services;

public interface IIrrigationCalculatorService
{
    Task<IrrigationCalculatorResponse?> CalculateAsync(string soilType, string climate, string crop, decimal landArea, string lang, CancellationToken ct = default);
}
