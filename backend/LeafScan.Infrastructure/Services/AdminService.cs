using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using LeafScan.Infrastructure.Data;
using LeafScan.Infrastructure.Prediction;
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

        // ── Healthy vs diseased share (per AI diagnosis row, PlantVillage-style *___healthy labels) ──
        var healthyDiagnosisCount = await _db.Diagnoses.CountAsync(
            d => d.Disease.DiseaseName != null &&
                 d.Disease.DiseaseName.ToLower().EndsWith(PredictionLabels.HealthyNameSuffixLower),
            ct);

        double healthyRate;
        double diseaseRate;
        if (totalDiagnoses == 0)
        {
            healthyRate = 0;
            diseaseRate = 0;
        }
        else
        {
            var diseasedDiagnosisCount = totalDiagnoses - healthyDiagnosisCount;
            healthyRate = Math.Round(healthyDiagnosisCount * 100.0 / totalDiagnoses, 1);
            diseaseRate = Math.Round(diseasedDiagnosisCount * 100.0 / totalDiagnoses, 1);
        }

        // ── Last 7 days — images per day ──────────────────────────────────────
        var rawWeekly = await _db.PlantImages
            .Where(x => x.UploadDate >= sevenDaysAgo)
            .GroupBy(x => x.UploadDate.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        // Compare calendar days only — DateTime== can fail when Kind differs (UTC vs Unspecified from SQL).
        var last7Days = Enumerable.Range(0, 7)
            .Select(i => today.AddDays(-6 + i))
            .Select(d => new DailyCountDto(
                d.ToString("ddd"),
                rawWeekly.FirstOrDefault(x => SameCalendarDay(x.Date, d))?.Count ?? 0))
            .ToList();

        // ── Top diseases (exclude healthy classifications from distribution) ───
        var topRaw = await _db.Diagnoses
            .Where(d =>
                d.Disease.DiseaseName == null ||
                !d.Disease.DiseaseName.ToLower().EndsWith(PredictionLabels.HealthyNameSuffixLower))
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

    public async Task<AdminOperationalDiagnosticsDto> GetOperationalDiagnosticsAsync(CancellationToken ct = default)
    {
        var plantCount = await _db.PlantImages.CountAsync(ct);
        var diagCount = await _db.Diagnoses.CountAsync(ct);
        var systemUser = await _db.Users.AnyAsync(u => u.Id == PredictionSystemIds.AnonymousScannerUserId, ct);
        var defaultPlant = await _db.Plants.AnyAsync(
            p => p.UserId == PredictionSystemIds.AnonymousScannerUserId &&
                 p.PlantName == PredictionSystemIds.DefaultScanPlantName,
            ct);

        const string seedMigrationId = "20260515140000_SeedSystemPredictionEntities";
        var applied = await _db.Database.GetAppliedMigrationsAsync(ct);
        var seedApplied = applied.Contains(seedMigrationId);

        string? hint = null;
        if (!seedApplied || !systemUser || !defaultPlant)
            hint =
                "Prediction rows are not written until the DB has the system user + Default scan plant. Ensure EF migrations ran on this database (including " +
                seedMigrationId +
                "). See server logs if MigrateAsync failed at startup.";

        return new AdminOperationalDiagnosticsDto(
            plantCount,
            diagCount,
            systemUser,
            defaultPlant,
            seedApplied,
            hint);
    }

    private static bool SameCalendarDay(DateTime a, DateTime b) =>
        a.Year == b.Year && a.Month == b.Month && a.Day == b.Day;
}
