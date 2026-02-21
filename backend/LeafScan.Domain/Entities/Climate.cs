namespace LeafScan.Domain.Entities;

public class Climate
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<CropSoilClimate> CropSoilClimates { get; set; } = new List<CropSoilClimate>();
}
