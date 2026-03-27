namespace LeafScan.Domain.Entities;

public class ClimateTranslation
{
    public int ClimateId { get; set; }
    public string LanguageCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    public Climate Climate { get; set; } = null!;
}
