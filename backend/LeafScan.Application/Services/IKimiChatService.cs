using LeafScan.Application.DTOs;

namespace LeafScan.Application.Services;

public interface IKimiChatService
{
    /// <summary>
    /// Sends messages to Kimi AI and returns the assistant response.
    /// Persists user message and assistant response to the database.
    /// </summary>
    /// <param name="userId">Authenticated user ID</param>
    /// <param name="sessionId">Chat session ID (create new if null)</param>
    /// <param name="messages">Full conversation history [{ role, content }]</param>
    /// <param name="language">Optional language code (en/ar)</param>
    /// <param name="ct">Cancellation token</param>
    /// <returns>Assistant content and session ID (new if created)</returns>
    Task<(string Content, Guid SessionId)> ChatAsync(
        Guid userId,
        Guid? sessionId,
        IReadOnlyList<ChatMessageDto> messages,
        string? language,
        CancellationToken ct = default);

    /// <summary>Returns all chat sessions for the user, newest activity first.</summary>
    Task<IReadOnlyList<ChatSessionSummaryDto>> GetSessionsAsync(
        Guid userId,
        CancellationToken ct = default);

    /// <summary>Returns all messages in a session in chronological order. Empty list if not found / not owned by user.</summary>
    Task<IReadOnlyList<ChatHistoryMessageDto>> GetSessionMessagesAsync(
        Guid userId,
        Guid sessionId,
        CancellationToken ct = default);

    /// <summary>Deletes all messages in a session belonging to the user. Returns true if any rows were deleted.</summary>
    Task<bool> DeleteSessionAsync(
        Guid userId,
        Guid sessionId,
        CancellationToken ct = default);
}

public record ChatMessageDto(string Role, string Content);
