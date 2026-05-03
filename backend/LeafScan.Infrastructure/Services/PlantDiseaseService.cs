using System.Net.Http.Headers;
using System.Text.Json;
using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace LeafScan.Infrastructure.Services;

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

    public async Task<PredictionResult> PredictAsync(IFormFile image)
    {
        using var content = new MultipartFormDataContent();
        using var stream = image.OpenReadStream();
        var fileContent = new StreamContent(stream);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue(image.ContentType);
        content.Add(fileContent, "file", image.FileName);

        var response = await _httpClient.PostAsync($"{_pythonApiUrl}/predict", content);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception($"Python API error {response.StatusCode}: {error}");
        }

        var json = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<PredictionResult>(json, JsonOptions);
        return result ?? throw new Exception("Empty response from prediction service.");
    }
}
