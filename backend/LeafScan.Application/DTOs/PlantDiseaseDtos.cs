namespace LeafScan.Application.DTOs;

public class Top3Item
{
    public string Class { get; set; } = string.Empty;
    public double Confidence { get; set; }
}

public class PredictionResult
{
    public string PredictedClass { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public List<Top3Item> Top3 { get; set; } = new();
}
