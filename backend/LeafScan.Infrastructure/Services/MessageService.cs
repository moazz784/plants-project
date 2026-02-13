using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using LeafScan.Domain.Entities;
using LeafScan.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LeafScan.Infrastructure.Services;

public class MessageService : IMessageService
{
    private readonly ApplicationDbContext _db;

    public MessageService(ApplicationDbContext db) => _db = db;

    public async Task<MessageDto> CreateAsync(Guid userId, CreateMessageRequest request, CancellationToken ct = default)
    {
        var user = await _db.Users.FindAsync([userId], ct) ?? throw new InvalidOperationException("User not found");

        var msg = new Message
        {
            Id = Guid.NewGuid(),
            SenderUserId = userId,
            SenderFirstName = request.SenderFirstName,
            SenderLastName = request.SenderLastName,
            SenderEmail = request.SenderEmail,
            SenderPhone = request.SenderPhone,
            Body = request.Body,
            Status = "New",
            CreatedAtUtc = DateTime.UtcNow
        };
        _db.Messages.Add(msg);
        await _db.SaveChangesAsync(ct);

        return MapMessage(msg);
    }

    public async Task<IReadOnlyList<MessageDto>> GetAllAsync(CancellationToken ct = default)
    {
        var list = await _db.Messages.OrderByDescending(m => m.CreatedAtUtc).ToListAsync(ct);
        return list.Select(MapMessage).ToList();
    }

    public async Task<MessageDto?> PatchStatusAsync(Guid id, string status, CancellationToken ct = default)
    {
        var msg = await _db.Messages.FindAsync([id], ct);
        if (msg == null) return null;

        if (status is "Read" or "Archived")
        {
            msg.Status = status;
            await _db.SaveChangesAsync(ct);
        }

        return MapMessage(msg);
    }

    private static MessageDto MapMessage(Message m) => new(m.Id, m.SenderFirstName, m.SenderLastName, m.SenderEmail, m.SenderPhone, m.Body, m.Status, m.CreatedAtUtc);
}
