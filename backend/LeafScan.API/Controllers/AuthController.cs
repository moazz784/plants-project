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
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    private readonly IValidator<LoginRequest> _loginValidator;
    private readonly IValidator<RegisterRequest> _registerValidator;

    public AuthController(IAuthService auth, IValidator<LoginRequest> loginValidator, IValidator<RegisterRequest> registerValidator)
    {
        _auth = auth;
        _loginValidator = loginValidator;
        _registerValidator = registerValidator;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        var result = await _registerValidator.ValidateAsync(request, ct);
        if (!result.IsValid)
            return BadRequest(new { code = "VALIDATION_ERROR", message = "Validation failed", details = result.Errors });

        try
        {
            var response = await _auth.RegisterAsync(request, ct);
            return Ok(response);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("already registered"))
        {
            return BadRequest(new { code = "EMAIL_EXISTS", message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var result = await _loginValidator.ValidateAsync(request, ct);
        if (!result.IsValid)
            return BadRequest(new { code = "VALIDATION_ERROR", message = "Validation failed", details = result.Errors });

        var response = await _auth.LoginAsync(request, ct);
        if (response == null)
            return Unauthorized(new { code = "INVALID_CREDENTIALS", message = "Wrong email or password" });

        return Ok(response);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var id))
            return Unauthorized();

        var user = await _auth.GetMeAsync(id, ct);
        if (user == null) return NotFound(new { code = "USER_NOT_FOUND", message = "User not found" });

        return Ok(user);
    }
}
