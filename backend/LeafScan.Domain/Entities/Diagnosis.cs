namespace LeafScan.Domain.Entities;

public class Diagnosis
{
    public int DiagnosisId { get; set; }
    public bool DiagnosedByAi { get; set; }
    public DateTime DiagnosedDate { get; set; }
    public int ImageId { get; set; }
    public int DiseaseId { get; set; }

    public PlantImage PlantImage { get; set; } = null!;
    public Disease Disease { get; set; } = null!;
    public ICollection<Report> Reports { get; set; } = new List<Report>();
}
