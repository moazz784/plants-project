namespace LeafScan.Domain.Entities;

public class SoilTypeTranslation
{
    public int SoilTypeId { get; set; }
    public string LanguageCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    public SoilType SoilType { get; set; } = null!;
}
