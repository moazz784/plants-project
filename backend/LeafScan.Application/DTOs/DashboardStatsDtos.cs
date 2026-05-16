namespace LeafScan.Application.DTOs;

/// <summary>
/// Top-level dashboard statistics from GET /api/admin/stats.
/// <see cref="HealthyRatePercent"/> and <see cref="DiseaseRatePercent"/> are percentages of all AI diagnosis rows
/// (healthy = PlantVillage-style <c>*___healthy</c> disease names; diseased = all other stored labels).
/// </summary>
public record DashboardStatsDto(
    int TotalImages,
    int ImagesAddedToday,
    int TotalDiagnoses,
    int DiagnosesToday,
    int TotalUsers,
    int NewUsersToday,
    int TotalMessages,
    int NewMessagesToday,
    double DiseaseRatePercent,
    double HealthyRatePercent,
    IReadOnlyList<DailyCountDto> Last7DaysImages,
    IReadOnlyList<TopDiseaseDto> TopDiseases
);

/// <summary>Image upload count for a single day (used in the weekly bar chart).</summary>
public record DailyCountDto(string Day, int Count);

/// <summary>
/// A non-healthy disease with counts among AI diagnoses.
/// <see cref="Percent"/> is the share within the returned top list only (diseased classes; healthy excluded).
/// </summary>
public record TopDiseaseDto(string DiseaseName, int Count, double Percent);
