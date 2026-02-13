namespace LeafScan.Domain.Entities;

public class Plant
{
    public int PlantId { get; set; }
    public string PlantName { get; set; } = string.Empty;
    public string? Species { get; set; }
    public string? SoilType { get; set; }
    public Guid UserId { get; set; }

    public User User { get; set; } = null!;
    public ICollection<PlantImage> PlantImages { get; set; } = new List<PlantImage>();
    public ICollection<SoilData> SoilDataRecords { get; set; } = new List<SoilData>();
}
