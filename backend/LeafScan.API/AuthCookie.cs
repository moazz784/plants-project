using Microsoft.AspNetCore.Http;

namespace LeafScan.API;

public static class AuthCookie
{
    public const string Name = "leafscan_access_token";

    // Matches JWT access token lifetime in JwtService (15 minutes).
    private static readonly TimeSpan Lifetime = TimeSpan.FromMinutes(15);

    public static CookieOptions CreateAuthCookieOptions()
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Path = "/",
            MaxAge = Lifetime,
            IsEssential = true,
            SameSite = SameSiteMode.None,
            Secure = true,
        };
    }

    public static CookieOptions CreateDeleteCookieOptions()
    {
        var o = CreateAuthCookieOptions();
        o.MaxAge = TimeSpan.Zero;
        o.Expires = DateTime.UnixEpoch;
        return o;
    }
}

public static class RefreshCookie
{
    public const string Name = "leafscan_refresh_token";

    // Matches refresh token lifetime in AuthService (7 days).
    private static readonly TimeSpan Lifetime = TimeSpan.FromDays(7);

    public static CookieOptions CreateRefreshCookieOptions()
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Path = "/api/auth/refresh",
            MaxAge = Lifetime,
            IsEssential = true,
            SameSite = SameSiteMode.None,
            Secure = true,
        };
    }

    public static CookieOptions CreateDeleteCookieOptions()
    {
        var o = CreateRefreshCookieOptions();
        o.MaxAge = TimeSpan.Zero;
        o.Expires = DateTime.UnixEpoch;
        return o;
    }
}
