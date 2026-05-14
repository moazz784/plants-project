namespace LeafScan.Application.DTOs;

/// <summary>Top-level dashboard statistics returned by GET /api/admin/stats.</summary>
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

/// <summary>A disease with its diagnosis count and share of total diagnoses.</summary>
public record TopDiseaseDto(string DiseaseName, int Count, double Percent);
