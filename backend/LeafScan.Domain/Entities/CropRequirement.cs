namespace LeafScan.Domain.Entities;

public class CropRequirement
{
    public int CropId { get; set; }
    public decimal WaterLitersPerAcrePerWeek { get; set; }
    public decimal FertilizerKgPerAcre { get; set; }

    public Crop Crop { get; set; } = null!;
}
