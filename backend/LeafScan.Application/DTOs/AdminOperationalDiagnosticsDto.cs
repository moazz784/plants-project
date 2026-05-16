namespace LeafScan.Application.DTOs;

/// <summary>Read-only DB / migration checks for operators (GET /api/admin/diagnostics).</summary>
public record AdminOperationalDiagnosticsDto(
    int PlantImageRowCount,
    int DiagnosisRowCount,
    bool SystemAnonymousUserExists,
    bool DefaultScanPlantExists,
    bool SeedSystemPredictionEntitiesMigrationApplied,
    string? Hint);
