namespace LeafScan.Domain.Entities;

public class KimiChatMessage
{
    public long Id { get; set; }
    public Guid UserId { get; set; }
    public Guid SessionId { get; set; }
    public string Role { get; set; } = null!; // "user" | "assistant"
    public string Content { get; set; } = null!;
    public DateTime CreatedAtUtc { get; set; }

    public User User { get; set; } = null!;
}
