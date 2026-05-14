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
        PropertyNameCaseInsensitive = true
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

    public async Task<PredictionResult> PredictAsync(IFormFile image)
    {
        // Read bytes upfront — the stream can only be consumed once and we need
        // a reusable buffer for any future retry logic or logging.
        using var ms = new MemoryStream();
        await image.CopyToAsync(ms);
        var imageBytes = ms.ToArray();

        try
        {
            using var content = new MultipartFormDataContent();
            var fileContent = new ByteArrayContent(imageBytes);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(image.ContentType);
            content.Add(fileContent, "file", image.FileName);

            var response = await _httpClient.PostAsync($"{_pythonApiUrl}/predict", content);

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<PredictionResult>(json, JsonOptions);
                return result ?? throw new Exception("Empty response from prediction service.");
            }

            // Hugging Face Spaces returns 503 while the space is cold-starting.
            if ((int)response.StatusCode == 503)
                throw new ModelWarmingUpException(
                    "The AI model is warming up after inactivity. Please wait ~30 seconds and try again.");

            var error = await response.Content.ReadAsStringAsync();
            throw new Exception($"Python API error {response.StatusCode}: {error}");
        }
        catch (TaskCanceledException)
        {
            // HttpClient.Timeout (120 s) exceeded — model still cold-starting.
            throw new ModelWarmingUpException(
                "The AI model is taking longer than expected to respond. Please wait a moment and try again.");
        }
        catch (HttpRequestException ex)
        {
            throw new ModelWarmingUpException(
                $"Could not reach the prediction service. It may be starting up — please try again shortly. ({ex.Message})");
        }
    }
}
