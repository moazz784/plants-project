using LeafScan.Application.DTOs;

namespace LeafScan.Application.Services;

public interface IAdminService
{
    Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct = default);

    /// <summary>SQL row counts + seed/migration presence for troubleshooting zero dashboard stats.</summary>
    Task<AdminOperationalDiagnosticsDto> GetOperationalDiagnosticsAsync(CancellationToken ct = default);
}
