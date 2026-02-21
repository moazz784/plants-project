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
    private readonly IAdminDashboardService _dashboardService;

    public AdminController(IMessageService messageService, IAdminDashboardService dashboardService)
    {
        _messageService = messageService;
        _dashboardService = dashboardService;
    }

    [HttpGet("dashboard-stats")]
    public async Task<IActionResult> GetDashboardStats(CancellationToken ct)
    {
        var stats = await _dashboardService.GetStatsAsync(ct);
        return Ok(stats);
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
