namespace LeafScan.Domain.Entities;

public class CropTranslation
{
    public int CropId { get; set; }
    public string LanguageCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    public Crop Crop { get; set; } = null!;
}
