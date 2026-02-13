namespace LeafScan.Domain.Entities;

public class UserChat
{
    public Guid UserId { get; set; }
    public int ChatId { get; set; }

    public User User { get; set; } = null!;
    public ChatSession ChatSession { get; set; } = null!;
}
