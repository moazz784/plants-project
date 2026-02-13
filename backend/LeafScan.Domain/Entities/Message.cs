namespace LeafScan.Domain.Entities;

public class Message
{
    public Guid Id { get; set; }
    public Guid SenderUserId { get; set; }
    public User Sender { get; set; } = null!;
    public string SenderFirstName { get; set; } = string.Empty;
    public string SenderLastName { get; set; } = string.Empty;
    public string SenderEmail { get; set; } = string.Empty;
    public string? SenderPhone { get; set; }
    public string Body { get; set; } = string.Empty;
    public string Status { get; set; } = "New"; // New | Read | Archived
    public DateTime CreatedAtUtc { get; set; }
}
