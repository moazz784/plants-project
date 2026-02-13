namespace LeafScan.Domain.Entities;

public class PlantImage
{
    public int ImageId { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime UploadDate { get; set; }
    public int PlantId { get; set; }
    public Guid UserId { get; set; }

    public Plant Plant { get; set; } = null!;
    public User User { get; set; } = null!;
    public ICollection<Diagnosis> Diagnoses { get; set; } = new List<Diagnosis>();
    public ICollection<UserPlantImage> UserPlantImages { get; set; } = new List<UserPlantImage>();
}
