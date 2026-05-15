using LeafScan.Application.Services;
using LeafScan.Infrastructure.Data;
using LeafScan.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LeafScan.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        var conn = config.GetConnectionString("DefaultConnection")
            ?? "Server=(localdb)\\mssqllocaldb;Database=LeafScan;Trusted_Connection=True;TrustServerCertificate=True;";

        services.AddDbContext<ApplicationDbContext>(o => o.UseSqlServer(conn));
        services.AddHttpClient();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAdminService, AdminService>();
        services.AddScoped<IMessageService, MessageService>();
        services.AddScoped<IKimiChatService, KimiChatService>();
        services.AddSingleton<IJwtService, JwtService>();
        services.AddScoped<ICropRecommendationService, CropRecommendationService>();
        services.AddScoped<IIrrigationCalculatorService, IrrigationCalculatorService>();
        services.AddScoped<IPredictionPersistenceService, PredictionPersistenceService>();

        return services;
    }
}
