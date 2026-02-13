using LeafScan.Application.DTOs;

namespace LeafScan.Application.Services;

public interface IAuthService
{
    Task<AuthResponse?> LoginAsync(LoginRequest request, CancellationToken ct = default);
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct = default);
    Task<AuthUserDto?> GetMeAsync(Guid userId, CancellationToken ct = default);
    Task<AuthUserDto?> UpdateProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken ct = default);
}
