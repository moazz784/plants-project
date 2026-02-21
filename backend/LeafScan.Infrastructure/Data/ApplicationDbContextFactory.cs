using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace LeafScan.Infrastructure.Data;

/// <summary>
/// Design-time factory for EF Core tools (migrations, database update).
/// Use when running from Infrastructure: dotnet ef database update
/// Or specify startup project: dotnet ef database update --startup-project LeafScan.API
/// </summary>
public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var basePath = Path.Combine(Directory.GetCurrentDirectory(), "LeafScan.API");
        if (!Directory.Exists(basePath))
            basePath = Path.Combine(Directory.GetCurrentDirectory(), "..", "LeafScan.API");
        var config = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();

        var conn = config.GetConnectionString("DefaultConnection")
            ?? Environment.GetEnvironmentVariable("LEAFSCAN_CONNECTION")
            ?? "Server=(localdb)\\mssqllocaldb;Database=LeafScan;Trusted_Connection=True;TrustServerCertificate=True;";

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlServer(conn)
            .Options;

        return new ApplicationDbContext(options);
    }
}
