namespace LeafScan.Domain.Entities;

public class AiChatbot
{
    public int ChatbotId { get; set; }
    public string? Capabilities { get; set; }
    public string? ModelVersion { get; set; }
    public DateTime LastUpdated { get; set; }

    public ICollection<ChatSession> ChatSessions { get; set; } = new List<ChatSession>();
    public ICollection<Report> Reports { get; set; } = new List<Report>();
}
