namespace LeafScan.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "User"; // "User" | "Admin"
    public string? ProfileImageBase64 { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }

    public ICollection<Message> Messages { get; set; } = new List<Message>();
    public ICollection<Plant> Plants { get; set; } = new List<Plant>();
    public ICollection<PlantImage> PlantImages { get; set; } = new List<PlantImage>();
    public ICollection<ChatSession> ChatSessions { get; set; } = new List<ChatSession>();
    public ICollection<UserChat> UserChats { get; set; } = new List<UserChat>();
    public ICollection<UserPlantImage> UserPlantImages { get; set; } = new List<UserPlantImage>();
    public ICollection<Report> ReportsAsManager { get; set; } = new List<Report>();
    public ICollection<KimiChatMessage> KimiChatMessages { get; set; } = new List<KimiChatMessage>();
}
