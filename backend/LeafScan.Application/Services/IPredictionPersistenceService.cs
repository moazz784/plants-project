using LeafScan.Application.DTOs;

namespace LeafScan.Application.Services;

/// <summary>
/// Saves successful ML predictions into <c>PlantImages</c>/<c>Diagnoses</c> so admin dashboard stats reflect real scans.
/// </summary>
public interface IPredictionPersistenceService
{
    Task PersistSuccessfulPredictionAsync(Guid? authenticatedUserId, PredictionResult result, CancellationToken ct = default);
}
