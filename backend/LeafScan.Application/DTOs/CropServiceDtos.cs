namespace LeafScan.Application.DTOs;

public record CropRecommendationResponse(string[] Crops, string SoilType, string Climate);

public record IrrigationCalculatorResponse(decimal WaterLitersPerWeek, decimal FertilizerKg);
