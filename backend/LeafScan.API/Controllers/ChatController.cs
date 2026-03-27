using LeafScan.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LeafScan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IKimiChatService _kimiChatService;

    public ChatController(IKimiChatService kimiChatService)
    {
        _kimiChatService = kimiChatService;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ChatRequest request, CancellationToken ct)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        if (request.Messages == null || request.Messages.Count == 0)
            return BadRequest(new { code = "VALIDATION_ERROR", message = "At least one message is required." });

        var messages = request.Messages
            .Select(m => new ChatMessageDto(m.Role ?? "user", m.Content ?? ""))
            .ToList();

        if (messages.All(m => m.Role != "user"))
            return BadRequest(new { code = "VALIDATION_ERROR", message = "At least one user message is required." });

        Guid? sessionId = null;
        if (request.SessionId != null && Guid.TryParse(request.SessionId, out var sid))
            sessionId = sid;

        try
        {
            var (content, newSessionId) = await _kimiChatService.ChatAsync(
                userId,
                sessionId,
                messages,
                request.Language,
                ct);

            return Ok(new { content, sessionId = newSessionId });
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("ApiKey"))
        {
            return StatusCode(500, new { code = "CONFIG_ERROR", message = "Chat service is not configured." });
        }
    }
}

public class ChatRequest
{
    public string? SessionId { get; set; }
    public List<ChatMessageDtoRequest>? Messages { get; set; }
    public string? Language { get; set; }
}

public class ChatMessageDtoRequest
{
    public string? Role { get; set; }
    public string? Content { get; set; }
}
