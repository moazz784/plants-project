using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using LeafScan.Application.Validators;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LeafScan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _messageService;
    private readonly IValidator<CreateMessageRequest> _validator;

    public MessagesController(IMessageService messageService, IValidator<CreateMessageRequest> validator)
    {
        _messageService = messageService;
        _validator = validator;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateMessageRequest request, CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var id))
            return Unauthorized();

        var result = await _validator.ValidateAsync(request, ct);
        if (!result.IsValid)
            return BadRequest(new { code = "VALIDATION_ERROR", message = "Validation failed", details = result.Errors });

        var msg = await _messageService.CreateAsync(id, request, ct);
        return CreatedAtAction(nameof(Create), new { id = msg.Id }, msg);
    }
}
