using LeafScan.Application.DTOs;

namespace LeafScan.Application.Services;

/// <summary>
/// Saves successful ML predictions into <c>PlantImages</c>/<c>Diagnoses</c> so admin dashboard stats reflect real scans.
/// Optional <paramref name="imageRelativeUrl"/> (for example <c>/uploads/scans/...</c>) is stored when disk save succeeds.
/// </summary>
public interface IPredictionPersistenceService
{
    /// <summary>Returns whether a <see cref="PlantImage"/> row was inserted for this prediction.</summary>
    Task<bool> PersistSuccessfulPredictionAsync(
        Guid? authenticatedUserId,
        PredictionResult result,
        string? imageRelativeUrl,
        CancellationToken ct = default);
}
