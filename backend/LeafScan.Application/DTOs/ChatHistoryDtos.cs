namespace LeafScan.Application.DTOs;

/// <summary>
/// Summary of a chat session for the history sidebar.
/// Title is the first user message in the session.
/// </summary>
public record ChatSessionSummaryDto(
    Guid SessionId,
    string Title,
    DateTime LastActivityUtc,
    int MessageCount
);

/// <summary>
/// One message inside a session, as returned by GET /api/chat/sessions/{id}.
/// </summary>
public record ChatHistoryMessageDto(
    string Role,
    string Content,
    DateTime CreatedAtUtc
);
