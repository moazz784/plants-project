using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using LeafScan.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LeafScan.Infrastructure.Services;

public class AdminService : IAdminService
{
    private readonly ApplicationDbContext _db;

    public AdminService(ApplicationDbContext db) => _db = db;

    public async Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct = default)
    {
        var today = DateTime.UtcNow.Date;
        var sevenDaysAgo = today.AddDays(-6);

        // ── Images ────────────────────────────────────────────────────────────
        var totalImages = await _db.PlantImages.CountAsync(ct);
        var imagesAddedToday = await _db.PlantImages
            .CountAsync(x => x.UploadDate >= today && x.UploadDate < today.AddDays(1), ct);

        // ── Diagnoses ─────────────────────────────────────────────────────────
        var totalDiagnoses = await _db.Diagnoses.CountAsync(ct);
        var diagnosesToday = await _db.Diagnoses
            .CountAsync(x => x.DiagnosedDate >= today && x.DiagnosedDate < today.AddDays(1), ct);

        // ── Users (non-admin only) ────────────────────────────────────────────
        var totalUsers = await _db.Users.CountAsync(x => x.Role == "User", ct);
        var newUsersToday = await _db.Users
            .CountAsync(x => x.Role == "User" && x.CreatedAtUtc >= today && x.CreatedAtUtc < today.AddDays(1), ct);

        // ── Messages ──────────────────────────────────────────────────────────
        var totalMessages = await _db.Messages.CountAsync(ct);
        var newMessagesToday = await _db.Messages
            .CountAsync(x => x.CreatedAtUtc >= today && x.CreatedAtUtc < today.AddDays(1), ct);

        // ── Disease / healthy rate ────────────────────────────────────────────
        var imagesWithDiagnosis = await _db.Diagnoses
            .Select(d => d.ImageId)
            .Distinct()
            .CountAsync(ct);

        var diseaseRate = totalImages == 0
            ? 0.0
            : Math.Round(imagesWithDiagnosis * 100.0 / totalImages, 1);
        var healthyRate = Math.Round(100.0 - diseaseRate, 1);

        // ── Last 7 days — images per day ──────────────────────────────────────
        var rawWeekly = await _db.PlantImages
            .Where(x => x.UploadDate >= sevenDaysAgo)
            .GroupBy(x => x.UploadDate.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        var last7Days = Enumerable.Range(0, 7)
            .Select(i => today.AddDays(-6 + i))
            .Select(d => new DailyCountDto(
                d.ToString("ddd"),
                rawWeekly.FirstOrDefault(x => x.Date == d)?.Count ?? 0))
            .ToList();

        // ── Top diseases ──────────────────────────────────────────────────────
        var topRaw = await _db.Diagnoses
            .GroupBy(x => x.DiseaseId)
            .Select(g => new { DiseaseId = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(5)
            .ToListAsync(ct);

        var diseaseIds = topRaw.Select(x => x.DiseaseId).ToList();
        var diseaseNames = await _db.Diseases
            .Where(x => diseaseIds.Contains(x.DiseaseId))
            .Select(x => new { x.DiseaseId, x.DiseaseName })
            .ToListAsync(ct);

        var topTotal = topRaw.Sum(x => x.Count);
        var topDiseases = topRaw
            .Select(x => new TopDiseaseDto(
                diseaseNames.FirstOrDefault(d => d.DiseaseId == x.DiseaseId)?.DiseaseName ?? "Unknown",
                x.Count,
                topTotal == 0 ? 0 : Math.Round(x.Count * 100.0 / topTotal, 1)))
            .ToList();

        return new DashboardStatsDto(
            TotalImages: totalImages,
            ImagesAddedToday: imagesAddedToday,
            TotalDiagnoses: totalDiagnoses,
            DiagnosesToday: diagnosesToday,
            TotalUsers: totalUsers,
            NewUsersToday: newUsersToday,
            TotalMessages: totalMessages,
            NewMessagesToday: newMessagesToday,
            DiseaseRatePercent: diseaseRate,
            HealthyRatePercent: healthyRate,
            Last7DaysImages: last7Days,
            TopDiseases: topDiseases
        );
    }
}
