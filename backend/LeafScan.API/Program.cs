using System.Text;
using FluentValidation;
using LeafScan.Application.DTOs;
using LeafScan.Application.Services;
using LeafScan.Application.Validators;
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
    }
    catch (Exception ex)
    {
        logger.LogCritical(ex, "Database migration failed. Check connection string and that SQL Server is accessible from the host.");
        Console.Error.WriteLine($"Startup failed: {ex.Message}");
        throw;
    }
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Health / info endpoint at root — visible in the browser
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
        chat = new
        {
            send = "POST /api/chat"
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
