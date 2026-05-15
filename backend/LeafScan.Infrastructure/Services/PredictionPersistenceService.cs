using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using LeafScan.Domain.Entities;
using LeafScan.Infrastructure.Data;
using LeafScan.Infrastructure.Prediction;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LeafScan.Infrastructure.Services;

public sealed class PredictionPersistenceService : IPredictionPersistenceService
{
    private readonly ApplicationDbContext _db;
    private readonly ILogger<PredictionPersistenceService> _logger;

    public PredictionPersistenceService(ApplicationDbContext db, ILogger<PredictionPersistenceService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task PersistSuccessfulPredictionAsync(
        Guid? authenticatedUserId,
        PredictionResult result,
        string? imageRelativeUrl,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(result.PredictedClass))
        {
            _logger.LogWarning("Skipping prediction persistence: empty PredictedClass.");
            return;
        }

        var plantId = await ResolvePlantIdAsync(result.PredictedClass, ct).ConfigureAwait(false);
        if (plantId is null)
            return;

        var userIdForImageRow = authenticatedUserId ?? PredictionSystemIds.AnonymousScannerUserId;
        if (!await _db.Users.AsNoTracking().AnyAsync(u => u.Id == userIdForImageRow, ct).ConfigureAwait(false))
        {
            _logger.LogWarning(
                "User {UserId} not found; falling back to system anonymous user for prediction persistence.",
                userIdForImageRow);
            userIdForImageRow = PredictionSystemIds.AnonymousScannerUserId;
        }

        var now = DateTime.UtcNow;
        var disease = await GetOrCreateDiseaseAsync(result.PredictedClass, ct).ConfigureAwait(false);

        var plantImage = new PlantImage
        {
            UploadDate = now,
            PlantId = plantId.Value,
            UserId = userIdForImageRow,
            ImageUrl = string.IsNullOrWhiteSpace(imageRelativeUrl) ? null : imageRelativeUrl
        };

        plantImage.Diagnoses.Add(new Diagnosis
        {
            DiseaseId = disease.DiseaseId,
            DiagnosedByAi = true,
            DiagnosedDate = now
        });

        _db.PlantImages.Add(plantImage);
        await _db.SaveChangesAsync(ct).ConfigureAwait(false);

        _logger.LogInformation(
            "Persisted scan to dashboard DB: ImageId={ImageId} PredictedClass={PredictedClass} UserId={UserId} HasImageUrl={HasUrl}",
            plantImage.ImageId,
            result.PredictedClass,
            userIdForImageRow,
            !string.IsNullOrWhiteSpace(imageRelativeUrl));
    }

    private async Task<int?> ResolvePlantIdAsync(string predictedClass, CancellationToken ct)
    {
        var defaultPlantId = await _db.Plants
            .Where(p =>
                p.UserId == PredictionSystemIds.AnonymousScannerUserId &&
                p.PlantName == PredictionSystemIds.DefaultScanPlantName)
            .Select(p => p.PlantId)
            .FirstOrDefaultAsync(ct)
            .ConfigureAwait(false);

        if (defaultPlantId == 0)
        {
            _logger.LogError(
                "Cannot persist prediction: system plant \"{Name}\" missing for user {UserId}. Run EF migrations.",
                PredictionSystemIds.DefaultScanPlantName,
                PredictionSystemIds.AnonymousScannerUserId);
            return null;
        }

        var prefix = CropPrefix(predictedClass);
        if (prefix is null)
            return defaultPlantId;

        var prefixLower = prefix.ToLowerInvariant();
        var match = await _db.Plants
            .Where(p => p.UserId == PredictionSystemIds.AnonymousScannerUserId &&
                        p.PlantName.ToLower() == prefixLower)
            .Select(p => p.PlantId)
            .FirstOrDefaultAsync(ct)
            .ConfigureAwait(false);

        return match == 0 ? defaultPlantId : match;
    }

    private static string? CropPrefix(string predictedClass)
    {
        const string sep = "___";
        var i = predictedClass.IndexOf(sep, StringComparison.Ordinal);
        if (i <= 0)
            return null;

        var raw = predictedClass[..i].Replace('_', ' ').Trim();
        return string.IsNullOrEmpty(raw) ? null : raw;
    }

    private async Task<Disease> GetOrCreateDiseaseAsync(string diseaseName, CancellationToken ct)
    {
        var existing = await _db.Diseases
            .FirstOrDefaultAsync(d => d.DiseaseName == diseaseName, ct)
            .ConfigureAwait(false);
        if (existing is not null)
            return existing;

        var disease = new Disease { DiseaseName = diseaseName };
        _db.Diseases.Add(disease);
        await _db.SaveChangesAsync(ct).ConfigureAwait(false);
        return disease;
    }
}
