using Microsoft.AspNetCore.Http;

namespace LeafScan.API.Extensions;

public static class LanguageExtensions
{
    /// <summary>
    /// Resolves language from query param "lang" or Accept-Language header. Returns "en" or "ar".
    /// </summary>
    public static string GetRequestLanguage(this HttpContext httpContext)
    {
        var lang = httpContext.Request.Query["lang"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(lang))
        {
            var normalized = lang.Trim().ToLowerInvariant();
            if (normalized.StartsWith("ar")) return "ar";
            if (normalized.StartsWith("en")) return "en";
        }

        var acceptLang = httpContext.Request.Headers.AcceptLanguage.FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(acceptLang))
        {
            var primary = acceptLang.Split(',')[0].Trim().ToLowerInvariant();
            if (primary.StartsWith("ar")) return "ar";
        }

        return "en";
    }
}
