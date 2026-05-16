using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using LeafScan.Application.Services;

namespace LeafScan.Infrastructure.Services;

/// <summary>Writes scanned leaf images to wwwroot/uploads/scans for dashboard / audit.</summary>
public sealed class ScanImageStorageService : IScanImageStorageService
{
    private static readonly HashSet<string> AllowedMimeTypes =
    [
        "image/jpeg",
        "image/jpg",
        "image/pjpeg",
        "image/png",
        "image/webp",
    ];

    private static readonly Dictionary<string, string> ExtensionToMime =
        new(StringComparer.OrdinalIgnoreCase)
        {
            [".jpg"] = "image/jpeg",
            [".jpeg"] = "image/jpeg",
            [".png"] = "image/png",
            [".webp"] = "image/webp",
        };

    private readonly IWebHostEnvironment _env;
    private readonly ILogger<ScanImageStorageService> _logger;

    public ScanImageStorageService(IWebHostEnvironment env, ILogger<ScanImageStorageService> logger)
    {
        _env = env;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<string?> TrySaveScanAsync(byte[] imageBytes, string contentType, string originalFileName,
        CancellationToken ct = default)
    {
        if (imageBytes.Length == 0)
            return null;

        var ext = ResolveExtension(contentType, originalFileName);
        if (ext is null)
        {
            _logger.LogWarning("Scan storage skipped: unsupported format (ContentType={ContentType}, File={File})",
                contentType, originalFileName);
            return null;
        }

        var wwwroot = _env.WebRootPath;
        if (string.IsNullOrWhiteSpace(wwwroot))
            wwwroot = Path.Combine(_env.ContentRootPath, "wwwroot");

        var year = DateTime.UtcNow.Year;
        var safeId = Guid.NewGuid().ToString("N");
        var storedName = $"{safeId}{ext}";
        var relativeUrl = $"/uploads/scans/{year}/{storedName}";

        var dir = Path.Combine(wwwroot, "uploads", "scans", year.ToString());
        try
        {
            Directory.CreateDirectory(dir);
            var fullPath = Path.Combine(dir, storedName);
            await File.WriteAllBytesAsync(fullPath, imageBytes, ct).ConfigureAwait(false);
            return relativeUrl;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to write scan image to {Directory}", dir);
            return null;
        }
    }

    private static string? ResolveExtension(string contentType, string originalFileName)
    {
        if (!string.IsNullOrWhiteSpace(contentType))
        {
            try
            {
                var mt = System.Net.Http.Headers.MediaTypeHeaderValue.Parse(contentType.Trim()).MediaType;
                if (mt is not null && AllowedMimeTypes.Contains(mt.ToLowerInvariant()))
                {
                    return mt.ToLowerInvariant() switch
                    {
                        "image/jpeg" or "image/jpg" or "image/pjpeg" => ".jpg",
                        "image/png" => ".png",
                        "image/webp" => ".webp",
                        _ => null
                    };
                }
            }
            catch
            {
                // fall through to extension
            }
        }

        var ext = Path.GetExtension(originalFileName);
        if (string.IsNullOrEmpty(ext))
            return null;
        ext = ext.ToLowerInvariant();
        if (ext == ".jpeg")
            ext = ".jpg";
        return ExtensionToMime.ContainsKey(ext) ? ext : null;
    }
}
