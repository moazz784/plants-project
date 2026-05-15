using System.Net.Http.Headers;
using System.Text.Json;
using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace LeafScan.Infrastructure.Services;

/// <summary>Thrown when the Python model service is still cold-starting.</summary>
public sealed class ModelWarmingUpException(string message) : Exception(message);

public class PlantDiseaseService : IPlantDiseaseService
{
    private readonly HttpClient _httpClient;
    private readonly string _pythonApiUrl;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
    };

    public PlantDiseaseService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _pythonApiUrl = config["PythonApi:BaseUrl"]?.TrimEnd('/') ?? "http://localhost:8000";
    }

    public async Task<bool> WarmUpAsync()
    {
        try
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
            var response = await _httpClient.GetAsync($"{_pythonApiUrl}/health", cts.Token);
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    public async Task<PredictionResult> PredictAsync(IFormFile image, CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(image);

        await using var ms = new MemoryStream();
        await image.CopyToAsync(ms, ct).ConfigureAwait(false);
        return await PredictAsync(ms.ToArray(), image.ContentType ?? string.Empty, image.FileName ?? "image.jpg", ct)
            .ConfigureAwait(false);
    }

    public async Task<PredictionResult> PredictAsync(byte[] imageBytes, string contentType, string fileName,
        CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(imageBytes);
        if (imageBytes.Length == 0)
            throw new ArgumentException("Image is empty.", nameof(imageBytes));

        var normalizedType = NormalizeContentType(contentType);
        var safeName = string.IsNullOrWhiteSpace(fileName)
            ? "image.jpg"
            : Path.GetFileName(fileName);

        try
        {
            using var content = new MultipartFormDataContent();
            var fileContent = new ByteArrayContent(imageBytes);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(normalizedType);
            content.Add(fileContent, "file", safeName);

            var response =
                await _httpClient.PostAsync($"{_pythonApiUrl}/predict", content, ct).ConfigureAwait(false);

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
                var result = JsonSerializer.Deserialize<PredictionResult>(json, JsonOptions);
                return result ?? throw new InvalidOperationException("Empty response from prediction service.");
            }

            if ((int)response.StatusCode == 503)
                throw new ModelWarmingUpException(
                    "The AI model is warming up after inactivity. Please wait ~30 seconds and try again.");

            var error = await response.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
            throw new InvalidOperationException($"Python API error {response.StatusCode}: {error}");
        }
        catch (TaskCanceledException)
        {
            throw new ModelWarmingUpException(
                "The AI model is taking longer than expected to respond. Please wait a moment and try again.");
        }
        catch (HttpRequestException ex)
        {
            throw new ModelWarmingUpException(
                $"Could not reach the prediction service. It may be starting up — please try again shortly. ({ex.Message})");
        }
    }

    private static string NormalizeContentType(string? contentType)
    {
        if (string.IsNullOrWhiteSpace(contentType))
            return "image/jpeg";
        try
        {
            var mt = MediaTypeHeaderValue.Parse(contentType.Trim()).MediaType;
            if (mt is null)
                return "image/jpeg";
            return mt.ToLowerInvariant() switch
            {
                "image/jpeg" or "image/jpg" or "image/pjpeg" => "image/jpeg",
                "image/png" => "image/png",
                "image/webp" => "image/webp",
                _ => "image/jpeg"
            };
        }
        catch
        {
            return "image/jpeg";
        }
    }
}
