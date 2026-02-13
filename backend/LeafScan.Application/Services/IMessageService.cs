using LeafScan.Application.DTOs;

namespace LeafScan.Application.Services;

public interface IMessageService
{
    Task<MessageDto> CreateAsync(Guid userId, CreateMessageRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<MessageDto>> GetAllAsync(CancellationToken ct = default);
    Task<MessageDto?> PatchStatusAsync(Guid id, string status, CancellationToken ct = default);
}
