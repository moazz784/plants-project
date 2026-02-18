using LeafScan.Application.DTOs;

namespace LeafScan.Application.Services;

public interface IAdminDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct = default);
}
