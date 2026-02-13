namespace LeafScan.Domain.Entities;

public class SoilData
{
    public int SoilId { get; set; }
    public decimal? MoistureLevel { get; set; }
    public decimal? PhLevel { get; set; }
    public decimal? Nitrogen { get; set; }
    public decimal? Phosphorus { get; set; }
    public decimal? Potassium { get; set; }
    public int PlantId { get; set; }

    public Plant Plant { get; set; } = null!;
}
