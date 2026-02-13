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
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IAuthService _auth;
    private readonly IValidator<UpdateProfileRequest> _validator;

    public UsersController(IAuthService auth, IValidator<UpdateProfileRequest> validator)
    {
        _auth = auth;
        _validator = validator;
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateProfileRequest request, CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var id))
            return Unauthorized();

        var result = await _validator.ValidateAsync(request, ct);
        if (!result.IsValid)
            return BadRequest(new { code = "VALIDATION_ERROR", message = "Validation failed", details = result.Errors });

        var user = await _auth.UpdateProfileAsync(id, request, ct);
        if (user == null) return NotFound(new { code = "USER_NOT_FOUND", message = "User not found" });

        return Ok(user);
    }
}
