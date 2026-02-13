namespace LeafScan.Domain.Entities;

public class Report
{
    public int ReportId { get; set; }
    public string? Content { get; set; }
    public DateTime GeneratedDate { get; set; }
    public string? ReportType { get; set; }
    public int? DiagnosisId { get; set; }
    public int? ChatbotId { get; set; }
    public Guid? ManagerId { get; set; } // Admin (manager) who generated/reviewed the report

    public Diagnosis? Diagnosis { get; set; }
    public AiChatbot? Chatbot { get; set; }
    public User? Manager { get; set; }
}
