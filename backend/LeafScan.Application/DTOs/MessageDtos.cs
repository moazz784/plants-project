namespace LeafScan.Application.DTOs;

public record CreateMessageRequest(string SenderFirstName, string SenderLastName, string SenderEmail, string? SenderPhone, string Body);

public record MessageDto(Guid Id, string SenderFirstName, string SenderLastName, string SenderEmail, string? SenderPhone, string Body, string Status, DateTime CreatedAtUtc);

public record PatchMessageRequest(string Status); // Read | Archived
