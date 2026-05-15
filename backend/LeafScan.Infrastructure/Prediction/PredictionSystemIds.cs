namespace LeafScan.Infrastructure.Prediction;

/// <summary>
/// Stable IDs for seeded system entities (see migration SeedSystemPredictionEntities).
/// </summary>
public static class PredictionSystemIds
{
    /// <summary>
    /// User who "owns" the default scan plant used when assigning <c>PlantId</c>, and fallback <c>UserId</c> for anonymous scans.
    /// </summary>
    public static readonly Guid AnonymousScannerUserId = Guid.Parse("00000000-0000-4000-8000-000000000001");

    internal const string DefaultScanPlantName = "Default scan";
    internal const string SystemUserEmail = "system-leafscan@internal.local";
}
