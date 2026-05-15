using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeafScan.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IMessageService _messageService;
    private readonly IAdminService _adminService;

    public AdminController(IMessageService messageService, IAdminService adminService)
    {
        _messageService = messageService;
        _adminService = adminService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats(CancellationToken ct)
    {
        var stats = await _adminService.GetStatsAsync(ct);
        return Ok(stats);
    }

    /// <summary>
    /// Row counts and seed/migration checks. Use when dashboard stats are zero but scans succeed (troubleshooting).
    /// </summary>
    [HttpGet("diagnostics")]
    public async Task<IActionResult> GetDiagnostics(CancellationToken ct)
    {
        var d = await _adminService.GetOperationalDiagnosticsAsync(ct);
        return Ok(d);
    }

    [HttpGet("messages")]
    public async Task<IActionResult> GetMessages(CancellationToken ct)
    {
        var messages = await _messageService.GetAllAsync(ct);
        return Ok(messages);
    }

    [HttpPatch("messages/{id:guid}")]
    public async Task<IActionResult> PatchMessage(Guid id, [FromBody] PatchMessageRequest request, CancellationToken ct)
    {
        var msg = await _messageService.PatchStatusAsync(id, request.Status, ct);
        if (msg == null) return NotFound(new { code = "MESSAGE_NOT_FOUND", message = "Message not found" });
        return Ok(msg);
    }
}
