namespace LeafScan.Domain.Entities;

public class ChatSession
{
    public int ChatId { get; set; }
    public string? Messages { get; set; }
    public string? Reply { get; set; }
    public DateTime CreatedDate { get; set; }
    public Guid UserId { get; set; }
    public int ChatbotId { get; set; }

    public User User { get; set; } = null!;
    public AiChatbot Chatbot { get; set; } = null!;
    public ICollection<UserChat> UserChats { get; set; } = new List<UserChat>();
}
