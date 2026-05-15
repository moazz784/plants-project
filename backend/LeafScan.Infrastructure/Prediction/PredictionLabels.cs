namespace LeafScan.Infrastructure.Prediction;

/// <summary>
/// ML classes follow PlantVillage-style names: <c>Crop___condition</c>, e.g. <c>Grape___healthy</c> vs <c>Tomato___Late_blight</c>.
/// Use the same rule in LINQ (<see cref="HealthyNameSuffixLower"/>) so EF Core can translate it to SQL (avoid LIKE with raw underscores).
/// </summary>
public static class PredictionLabels
{
    /// <summary>Lowercase suffix matching a healthy leaf class.</summary>
    public const string HealthyNameSuffixLower = "___healthy";

    public static bool IsHealthyClassification(string? diseaseName)
    {
        return diseaseName != null
               && diseaseName.ToLowerInvariant().EndsWith(HealthyNameSuffixLower, StringComparison.Ordinal);
    }
}
