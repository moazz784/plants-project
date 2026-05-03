using Microsoft.AspNetCore.Http;

namespace LeafScan.API;

public static class AuthCookie
{
    public const string Name = "leafscan_access_token";

    /// <summary>Matches JWT lifetime in JwtService (30 days).</summary>
    private static readonly TimeSpan Lifetime = TimeSpan.FromDays(30);

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
