namespace LeafScan.Domain.Entities;

public class UserPlantImage
{
    public Guid UserId { get; set; }
    public int ImageId { get; set; }

    public User User { get; set; } = null!;
    public PlantImage PlantImage { get; set; } = null!;
}
