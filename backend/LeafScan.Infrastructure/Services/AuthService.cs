using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using LeafScan.Domain.Entities;
using LeafScan.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LeafScan.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _db;
    private readonly IJwtService _jwt;

    public AuthService(ApplicationDbContext db, IJwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email, ct);
        if (user == null) return null;
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)) return null;

        return await IssueTokensAsync(user, ct);
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct = default)
    {
        var existing = await _db.Users.AnyAsync(u => u.Email == request.Email, ct);
        if (existing) throw new InvalidOperationException("Email already registered");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "User",
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);

        return await IssueTokensAsync(user, ct);
    }

    public async Task<AuthResponse?> RefreshAsync(string refreshToken, CancellationToken ct = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken, ct);
        if (user == null) return null;
        if (user.RefreshTokenExpiresAtUtc == null || user.RefreshTokenExpiresAtUtc < DateTime.UtcNow) return null;

        return await IssueTokensAsync(user, ct);
    }

    private async Task<AuthResponse> IssueTokensAsync(User user, CancellationToken ct)
    {
        var accessToken = _jwt.GenerateToken(user.Id, user.Email, user.Role);
        var refreshToken = _jwt.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiresAtUtc = DateTime.UtcNow.AddDays(7);
        await _db.SaveChangesAsync(ct);

        return new AuthResponse(accessToken, refreshToken, MapUser(user));
    }

    public async Task<AuthUserDto?> GetMeAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _db.Users.FindAsync([userId], ct);
        return user == null ? null : MapUser(user);
    }

    public async Task<AuthUserDto?> UpdateProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken ct = default)
    {
        var user = await _db.Users.FindAsync([userId], ct);
        if (user == null) return null;

        user.Name = request.Name;
        user.UpdatedAtUtc = DateTime.UtcNow;
        if (!string.IsNullOrEmpty(request.NewPassword))
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        if (request.ProfileImageBase64 != null)
            user.ProfileImageBase64 = request.ProfileImageBase64;

        await _db.SaveChangesAsync(ct);
        return MapUser(user);
    }

    private static AuthUserDto MapUser(User u) => new(u.Id, u.Name, u.Email, u.Role, u.ProfileImageBase64);
}
