namespace LeafScan.Application.DTOs;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(string Name, string Email, string Password);

public record AuthResponse(string Token, AuthUserDto User);

public record AuthUserDto(Guid Id, string Name, string Email, string Role, string? ProfileImageBase64);

public record UpdateProfileRequest(string Name, string? NewPassword, string? ProfileImageBase64);
