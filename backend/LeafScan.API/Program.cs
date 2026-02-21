using System.Text;
using FluentValidation;
using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using LeafScan.Application.Validators;
using LeafScan.Domain.Entities;
using LeafScan.Infrastructure.Data;
using LeafScan.Infrastructure.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme { Reference = new Microsoft.OpenApi.Models.OpenApiReference { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" } },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(o =>
{
    o.AddDefaultPolicy(p =>
    {
        p.SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrEmpty(origin)) return false;
            if (origin.StartsWith("http://localhost:") || origin.StartsWith("https://localhost:")) return true;
            if (origin.EndsWith(".vercel.app")) return true;
            return origin == "https://plants-project-lszl.vercel.app" || origin == "https://plants-project-p7j7.vercel.app";
        }).AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "LeafScan",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "LeafScan",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "LeafScanSecretKeyForJWTTokenGeneration12345"))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        await db.Database.MigrateAsync();
        await SeedAsync(db);
    }
    catch (Exception ex)
    {
        logger.LogCritical(ex, "Database migration or seed failed. Check connection string and that SQL Server is accessible from the host.");
        Console.Error.WriteLine($"Startup failed: {ex.Message}");
        throw;
    }
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Health / info endpoint at root ÔÇö visible in the browser
app.MapGet("/", () => Results.Json(new
{
    message = "LeafScan API",
    status = "healthy",
    endpoints = new
    {
        auth = new
        {
            login = "POST /api/auth/login",
            register = "POST /api/auth/register",
            me = "GET /api/auth/me"
        },
        users = new
        {
            updateProfile = "PUT /api/users/me"
        },
        messages = new
        {
            send = "POST /api/messages"
        },
        admin = new
        {
            listMessages = "GET /api/admin/messages",
            updateMessage = "PATCH /api/admin/messages/{id}"
        },
        services = new
        {
            soilTypes = "GET /api/services/soil-types",
            climates = "GET /api/services/climates",
            crops = "GET /api/services/crops",
            recommendations = "GET /api/services/recommendations?soilType=&climate=",
            calculate = "GET /api/services/calculate?soilType=&climate=&crop=&landArea="
        }
    },
    frontend = "https://plants-project-lszl.vercel.app",
    documentation = "This is a REST API server. Use the React client at the frontend URL for the web interface."
}));

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Run();

static async Task SeedAsync(ApplicationDbContext db)
{
    if (!await db.Users.AnyAsync(u => u.Role == "Admin"))
    {
        var admin = new User
        {
            Id = Guid.NewGuid(),
            Name = "Admin",
            Email = "admin@leafscan.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = "Admin",
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };
        db.Users.Add(admin);
        await db.SaveChangesAsync();
    }

    await SeedCropDataAsync(db);
}

static async Task SeedCropDataAsync(ApplicationDbContext db)
{
    if (!await db.SoilTypes.AnyAsync())
    {
        foreach (var name in new[] { "Sandy", "Clay", "Silt", "Loam" })
            db.SoilTypes.Add(new SoilType { Name = name });
        await db.SaveChangesAsync();
    }
    if (!await db.Climates.AnyAsync())
    {
        foreach (var name in new[] { "Arid", "Humid", "Cold", "Temperate", "Tropical" })
            db.Climates.Add(new Climate { Name = name });
        await db.SaveChangesAsync();
    }
    if (!await db.Crops.AnyAsync())
    {
        var cropNames = new[] { "Watermelon", "Peanuts", "Sorghum", "Millet", "Rice", "Lettuce", "Potato", "Barley", "Oats", "Tomato", "Wheat", "Corn", "Cantaloupe", "Cucumber", "Carrot", "Soybean", "Banana", "Sugarcane", "Pepper", "Onion", "Cabbage", "Beans", "Cotton", "Sunflower", "Peas", "Lentils", "Spinach", "Broccoli", "Celery", "Garlic", "Pumpkin", "Squash", "Eggplant", "Okra", "Radish", "Turnip", "Parsley", "Mint", "Basil", "Apple", "Peach", "Grape", "Blueberry", "Raspberry", "Cassava", "Asparagus" };
        foreach (var name in cropNames)
            db.Crops.Add(new Crop { Name = name });
        await db.SaveChangesAsync();
    }

    var reqs = new Dictionary<string, (decimal Water, decimal Fertilizer)>(StringComparer.OrdinalIgnoreCase)
    {
        ["Rice"] = (720, 28), ["Lettuce"] = (450, 15), ["Potato"] = (380, 22), ["Barley"] = (400, 14), ["Oats"] = (420, 12),
        ["Tomato"] = (550, 18), ["Wheat"] = (450, 12), ["Corn"] = (600, 25), ["Watermelon"] = (580, 16), ["Cucumber"] = (500, 18),
        ["Carrot"] = (450, 16), ["Soybean"] = (480, 20), ["Banana"] = (650, 30), ["Sugarcane"] = (900, 35), ["Pepper"] = (520, 20),
        ["Onion"] = (420, 18), ["Cabbage"] = (480, 22), ["Beans"] = (400, 16), ["Cotton"] = (600, 28), ["Sunflower"] = (450, 18),
        ["Peas"] = (380, 14), ["Lentils"] = (350, 12), ["Spinach"] = (420, 16), ["Broccoli"] = (480, 22), ["Celery"] = (550, 20),
        ["Garlic"] = (400, 16), ["Pumpkin"] = (500, 18), ["Squash"] = (480, 18), ["Eggplant"] = (520, 20), ["Okra"] = (500, 20),
        ["Radish"] = (400, 14), ["Turnip"] = (420, 16), ["Parsley"] = (450, 14), ["Mint"] = (500, 16), ["Basil"] = (480, 16),
        ["Cantaloupe"] = (560, 18), ["Sorghum"] = (450, 18), ["Millet"] = (400, 14), ["Peanuts"] = (450, 20), ["Cassava"] = (500, 22), ["Asparagus"] = (450, 24)
    };

    var soils = await db.SoilTypes.ToDictionaryAsync(s => s.Name, StringComparer.OrdinalIgnoreCase);
    var climates = await db.Climates.ToDictionaryAsync(c => c.Name, StringComparer.OrdinalIgnoreCase);
    var crops = await db.Crops.ToDictionaryAsync(c => c.Name, StringComparer.OrdinalIgnoreCase);

    foreach (var (cropName, (water, fert)) in reqs)
    {
        if (!crops.TryGetValue(cropName, out var crop)) continue;
        if (await db.CropRequirements.AnyAsync(cr => cr.CropId == crop.Id)) continue;
        db.CropRequirements.Add(new CropRequirement { CropId = crop.Id, WaterLitersPerAcrePerWeek = water, FertilizerKgPerAcre = fert });
    }
    await db.SaveChangesAsync();

    var suitability = new[] {
        ("Tomato", "Sandy", "Arid"), ("Tomato", "Sandy", "Humid"), ("Tomato", "Silt", "Arid"), ("Tomato", "Silt", "Humid"), ("Tomato", "Clay", "Temperate"), ("Tomato", "Loam", "Temperate"), ("Tomato", "Loam", "Humid"),
        ("Wheat", "Loam", "Arid"), ("Wheat", "Sandy", "Arid"), ("Wheat", "Clay", "Temperate"),
        ("Corn", "Loam", "Temperate"), ("Corn", "Clay", "Humid"), ("Corn", "Silt", "Tropical"),
        ("Rice", "Clay", "Humid"), ("Rice", "Clay", "Tropical"), ("Rice", "Silt", "Humid"),
        ("Potato", "Sandy", "Cold"), ("Potato", "Loam", "Temperate"), ("Potato", "Silt", "Humid"),
        ("Watermelon", "Sandy", "Arid"), ("Watermelon", "Sandy", "Humid"), ("Watermelon", "Loam", "Tropical"),
        ("Lettuce", "Loam", "Cold"), ("Lettuce", "Silt", "Temperate"), ("Lettuce", "Clay", "Humid"),
        ("Cucumber", "Loam", "Temperate"), ("Cucumber", "Sandy", "Humid"), ("Carrot", "Sandy", "Cold"), ("Carrot", "Loam", "Temperate"),
        ("Soybean", "Loam", "Temperate"), ("Soybean", "Clay", "Humid"), ("Peanuts", "Sandy", "Arid"), ("Peanuts", "Sandy", "Humid")
    };

    foreach (var (cropName, soilName, climateName) in suitability)
    {
        if (!crops.TryGetValue(cropName, out var crop) || !soils.TryGetValue(soilName, out var soil) || !climates.TryGetValue(climateName, out var climate)) continue;
        if (await db.CropSoilClimates.AnyAsync(csc => csc.CropId == crop.Id && csc.SoilTypeId == soil.Id && csc.ClimateId == climate.Id)) continue;
        db.CropSoilClimates.Add(new CropSoilClimate { CropId = crop.Id, SoilTypeId = soil.Id, ClimateId = climate.Id });
    }
    await db.SaveChangesAsync();
}
