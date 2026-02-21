using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using LeafScan.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LeafScan.Infrastructure.Services;

public class AdminDashboardService : IAdminDashboardService
{
    private readonly ApplicationDbContext _db;

    public AdminDashboardService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct = default)
    {
        var totalImages = await _db.PlantImages.CountAsync(ct);

        var diagnosesQuery = _db.Diagnoses
            .Include(d => d.Disease)
            .Select(d => new { d.DiseaseId, d.Disease!.DiseaseName, d.DiagnosedDate });

        var diagnosisCounts = await diagnosesQuery
            .GroupBy(d => new { d.DiseaseId, d.DiseaseName })
            .Select(g => new { g.Key.DiseaseName, Count = g.Count() })
            .ToListAsync(ct);

        var totalDiagnoses = diagnosisCounts.Sum(x => x.Count);
        var diseaseDistribution = diagnosisCounts
            .Select(x => new DiseaseStatDto(
                x.DiseaseName,
                x.Count,
                totalDiagnoses > 0 ? Math.Round((decimal)x.Count / totalDiagnoses * 100, 2) : 0
            ))
            .OrderByDescending(x => x.Count)
            .ToList();

        var sevenDaysAgo = DateTime.UtcNow.Date.AddDays(-6);
        var dailyCounts = await _db.Diagnoses
            .Where(d => d.DiagnosedDate >= sevenDaysAgo)
            .GroupBy(d => d.DiagnosedDate.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        var dailyAnalysis = Enumerable.Range(0, 7)
            .Select(i => sevenDaysAgo.AddDays(i))
            .Select(d => new DailyAnalysisDto(
                d.ToString("yyyy-MM-dd"),
                dailyCounts.FirstOrDefault(x => x.Date == d)?.Count ?? 0
            ))
            .ToList();

        return new DashboardStatsDto(
            totalImages,
            diseaseDistribution,
            dailyAnalysis,
            diseaseDistribution.Take(5).ToList()
        );
    }
}
