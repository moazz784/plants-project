using System.Net.Http.Json;
using System.Text.Json;
using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using LeafScan.Domain.Entities;
using LeafScan.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace LeafScan.Infrastructure.Services;

public class KimiChatService : IKimiChatService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;
    private readonly ApplicationDbContext _db;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        PropertyNameCaseInsensitive = true
    };

    public KimiChatService(
        IHttpClientFactory httpClientFactory,
        IConfiguration config,
        ApplicationDbContext db)
    {
        _httpClientFactory = httpClientFactory;
        _config = config;
        _db = db;
    }

    public async Task<(string Content, Guid SessionId)> ChatAsync(
        Guid userId,
        Guid? sessionId,
        IReadOnlyList<ChatMessageDto> messages,
        string? language,
        CancellationToken ct = default)
    {
        var sid = sessionId ?? Guid.NewGuid();
        var apiKey = _config["Kimi:ApiKey"];
        var baseUrl = _config["Kimi:BaseUrl"]?.TrimEnd('/') ?? "https://api.moonshot.ai/v1";
        var model = _config["Kimi:Model"] ?? "kimi-k2-turbo-preview";

        if (string.IsNullOrEmpty(apiKey))
            throw new InvalidOperationException("Kimi:ApiKey is not configured.");

        var lastUserMessage = messages.LastOrDefault(m => m.Role == "user");
        if (lastUserMessage == null)
            throw new ArgumentException("At least one user message is required.");

        var systemPrompt = BuildSystemPrompt(language);
        var apiMessages = new List<object>
        {
            new { role = "system", content = systemPrompt }
        };
        foreach (var m in messages)
            apiMessages.Add(new { role = m.Role, content = m.Content });

        var requestBody = new
        {
            model,
            messages = apiMessages,
            temperature = 0.7
        };

        using var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
        var response = await client.PostAsJsonAsync(
            $"{baseUrl}/chat/completions",
            requestBody,
            JsonOptions,
            ct);

        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadFromJsonAsync<MoonshotResponse>(JsonOptions, ct)
            ?? throw new InvalidOperationException("Invalid Moonshot API response.");

        var content = json.Choices?.FirstOrDefault()?.Message?.Content?.Trim() ?? "I'm sorry, I couldn't generate a response.";

        var now = DateTime.UtcNow;
        _db.KimiChatMessages.Add(new KimiChatMessage
        {
            UserId = userId,
            SessionId = sid,
            Role = "user",
            Content = lastUserMessage.Content,
            CreatedAtUtc = now
        });
        _db.KimiChatMessages.Add(new KimiChatMessage
        {
            UserId = userId,
            SessionId = sid,
            Role = "assistant",
            Content = content,
            CreatedAtUtc = now
        });
        await _db.SaveChangesAsync(ct);

        return (content, sid);
    }

    public async Task<IReadOnlyList<ChatSessionSummaryDto>> GetSessionsAsync(
        Guid userId,
        CancellationToken ct = default)
    {
        return await _db.KimiChatMessages
            .Where(m => m.UserId == userId)
            .GroupBy(m => m.SessionId)
            .Select(g => new ChatSessionSummaryDto(
                g.Key,
                g.Where(x => x.Role == "user")
                 .OrderBy(x => x.CreatedAtUtc)
                 .Select(x => x.Content)
                 .FirstOrDefault() ?? "(empty)",
                g.Max(x => x.CreatedAtUtc),
                g.Count()))
            .OrderByDescending(s => s.LastActivityUtc)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<ChatHistoryMessageDto>> GetSessionMessagesAsync(
        Guid userId,
        Guid sessionId,
        CancellationToken ct = default)
    {
        return await _db.KimiChatMessages
            .Where(m => m.UserId == userId && m.SessionId == sessionId)
            .OrderBy(m => m.CreatedAtUtc)
            .Select(m => new ChatHistoryMessageDto(m.Role, m.Content, m.CreatedAtUtc))
            .ToListAsync(ct);
    }

    public async Task<bool> DeleteSessionAsync(
        Guid userId,
        Guid sessionId,
        CancellationToken ct = default)
    {
        var deleted = await _db.KimiChatMessages
            .Where(m => m.UserId == userId && m.SessionId == sessionId)
            .ExecuteDeleteAsync(ct);
        return deleted > 0;
    }

    private static string BuildSystemPrompt(string? language)
    {
        var isArabic = language?.StartsWith("ar", StringComparison.OrdinalIgnoreCase) == true;
        var lang = isArabic ? "Arabic" : "English";

        return $@"You are the LeafScan AI assistant. Respond in {lang} unless the user explicitly asks for another language.

## About LeafScan
LeafScan is an AI-powered plant health platform. We help users diagnose plant diseases from leaf images, monitor plant vital signs, and provide agricultural recommendations.

## Services
- **Plant Diagnosis**: AI analysis of leaf images to detect diseases and health issues
- **Crop Recommendation**: Recommendations based on soil type and climate
- **Irrigation Calculator**: Calculate water needs for crops based on land area and conditions
- **Soil Detection**: Soil analysis and recommendations

## Contact
- Phone: +01015486616
- Email: Ahmedomarali23@gmail.com
- Use the Contact Us page on our website to send messages to our team

## Important
If you cannot answer the user's question, fulfill their request, or the topic is outside LeafScan's scope (plant health, crops, irrigation, soil), politely say: ""I can't help with that. Please go to Contact Us and send your message to our team.""";
    }

    private sealed class MoonshotResponse
    {
        public List<MoonshotChoice>? Choices { get; set; }
    }

    private sealed class MoonshotChoice
    {
        public MoonshotMessage? Message { get; set; }
    }

    private sealed class MoonshotMessage
    {
        public string? Content { get; set; }
    }
}
