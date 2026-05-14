using LeafScan.Application.DTOs;

namespace LeafScan.Application.Services;

public interface IAdminService
{
    Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct = default);
}
