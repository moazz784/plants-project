namespace LeafScan.Domain.Entities;

public class Disease
{
    public int DiseaseId { get; set; }
    public string DiseaseName { get; set; } = string.Empty;
    public string? Symptoms { get; set; }
    public string? SeverityLevel { get; set; }

    public ICollection<Diagnosis> Diagnoses { get; set; } = new List<Diagnosis>();
}
