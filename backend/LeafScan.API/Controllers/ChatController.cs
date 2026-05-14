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

    /// <summary>List all chat sessions for the current user, newest first.</summary>
    [HttpGet("sessions")]
    public async Task<IActionResult> GetSessions(CancellationToken ct)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var sessions = await _kimiChatService.GetSessionsAsync(userId, ct);
        return Ok(sessions);
    }

    /// <summary>Load all messages in a single chat session, in chronological order.</summary>
    [HttpGet("sessions/{sessionId:guid}")]
    public async Task<IActionResult> GetSessionMessages(Guid sessionId, CancellationToken ct)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var messages = await _kimiChatService.GetSessionMessagesAsync(userId, sessionId, ct);
        if (messages.Count == 0)
            return NotFound(new { code = "SESSION_NOT_FOUND", message = "No chat session found with that id." });

        return Ok(messages);
    }

    /// <summary>Permanently delete a chat session belonging to the current user.</summary>
    [HttpDelete("sessions/{sessionId:guid}")]
    public async Task<IActionResult> DeleteSession(Guid sessionId, CancellationToken ct)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var deleted = await _kimiChatService.DeleteSessionAsync(userId, sessionId, ct);
        if (!deleted)
            return NotFound(new { code = "SESSION_NOT_FOUND", message = "No chat session found with that id." });

        return NoContent();
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
