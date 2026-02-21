namespace LeafScan.Application.DTOs;

public record DashboardStatsDto(
    int TotalImages,
    IReadOnlyList<DiseaseStatDto> DiseaseDistribution,
    IReadOnlyList<DailyAnalysisDto> DailyAnalysis,
    IReadOnlyList<DiseaseStatDto> MostCommonDiseases
);

public record DiseaseStatDto(string DiseaseName, int Count, decimal Percentage);

public record DailyAnalysisDto(string Date, int Count);
