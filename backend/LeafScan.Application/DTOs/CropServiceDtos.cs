namespace LeafScan.Application.DTOs;

public record SoilTypeDto(int Id, string Name);
public record ClimateDto(int Id, string Name);
public record CropDto(int Id, string Name);

public record RecommendationResponse(
    IReadOnlyList<string> Crops,
    string SoilType,
    string Climate
);

public record CalculationResponse(
    decimal WaterLitersPerWeek,
    decimal FertilizerKg
);
