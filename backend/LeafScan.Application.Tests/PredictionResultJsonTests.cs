using System.Text.Json;
using LeafScan.Application.DTOs;
using Xunit;

namespace LeafScan.Application.Tests;

public class PredictionResultJsonTests
{
    /// <summary>
    /// Python /predict returns snake_case. Must stay in sync with <c>PlantDiseaseService</c>
    /// (global API JSON uses camelCase for browser responses separately).
    /// </summary>
    private static readonly JsonSerializerOptions PlantServiceJsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
    };

    [Fact]
    public void Deserialize_PythonSnakeCase_BindsPredictedClass()
    {
        const string json =
            """{"predicted_class":"Tomato___Late_blight","confidence":42.5,"top3":[{"class":"Tomato___Late_blight","confidence":42.5},{"class":"Potato___Healthy","confidence":10.0},{"class":"Pepper___Bacterial_spot","confidence":5.0}]}""";

        var r = JsonSerializer.Deserialize<PredictionResult>(json, PlantServiceJsonOptions);

        Assert.NotNull(r);
        Assert.Equal("Tomato___Late_blight", r.PredictedClass);
        Assert.Equal(42.5, r.Confidence);
        Assert.Equal(3, r.Top3.Count);
        Assert.Equal("Tomato___Late_blight", r.Top3[0].Class);
    }

    [Fact]
    public void Serialize_AspNetCamelCasePolicy_UsesPredictedClassForBrowser()
    {
        var r = new PredictionResult
        {
            PredictedClass = "Tomato___Late_blight",
            Confidence = 42.5,
            Top3 = [],
            PersistedToDashboard = true,
        };
        var json = JsonSerializer.Serialize(r, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        });
        Assert.Contains("\"predictedClass\"", json);
        Assert.DoesNotContain("\"predicted_class\"", json);
    }
}
