namespace LeafScan.Domain.Entities;

public class CropSoilClimate
{
    public int CropId { get; set; }
    public int SoilTypeId { get; set; }
    public int ClimateId { get; set; }

    public Crop Crop { get; set; } = null!;
    public SoilType SoilType { get; set; } = null!;
    public Climate Climate { get; set; } = null!;
}
