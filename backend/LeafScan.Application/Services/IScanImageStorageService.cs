namespace LeafScan.Application.Services;

/// <summary>
/// Saves leaf-scan uploads under wwwroot for optional dashboard analysis / auditing.
/// </summary>
public interface IScanImageStorageService
{
    /// <summary>Returns a site-relative URL (e.g. /uploads/scans/2026/...) or null if skipped/failed.</summary>
    Task<string?> TrySaveScanAsync(byte[] imageBytes, string contentType, string originalFileName, CancellationToken ct = default);
}
