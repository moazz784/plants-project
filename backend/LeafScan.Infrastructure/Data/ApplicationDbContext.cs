using LeafScan.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LeafScan.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Disease> Diseases => Set<Disease>();
    public DbSet<Plant> Plants => Set<Plant>();
    public DbSet<AiChatbot> AiChatbots => Set<AiChatbot>();
    public DbSet<ChatSession> ChatSessions => Set<ChatSession>();
    public DbSet<PlantImage> PlantImages => Set<PlantImage>();
    public DbSet<SoilData> SoilData => Set<SoilData>();
    public DbSet<UserChat> UserChats => Set<UserChat>();
    public DbSet<Diagnosis> Diagnoses => Set<Diagnosis>();
    public DbSet<UserPlantImage> UserPlantImages => Set<UserPlantImage>();
    public DbSet<Report> Reports => Set<Report>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.Role).HasMaxLength(20);
            e.Property(x => x.Name).HasMaxLength(200);
        });

        modelBuilder.Entity<Message>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Sender).WithMany(u => u.Messages).HasForeignKey(x => x.SenderUserId);
            e.HasIndex(x => x.CreatedAtUtc);
            e.HasIndex(x => x.Status);
            e.Property(x => x.Status).HasMaxLength(20);
        });

        modelBuilder.Entity<Disease>(e =>
        {
            e.HasKey(x => x.DiseaseId);
            e.Property(x => x.DiseaseName).HasMaxLength(200);
            e.Property(x => x.SeverityLevel).HasMaxLength(50);
        });

        modelBuilder.Entity<Plant>(e =>
        {
            e.HasKey(x => x.PlantId);
            e.HasOne(x => x.User).WithMany(u => u.Plants).HasForeignKey(x => x.UserId);
            e.Property(x => x.PlantName).HasMaxLength(200);
            e.Property(x => x.Species).HasMaxLength(200);
            e.Property(x => x.SoilType).HasMaxLength(100);
        });

        modelBuilder.Entity<AiChatbot>(e =>
        {
            e.HasKey(x => x.ChatbotId);
            e.Property(x => x.ModelVersion).HasMaxLength(100);
        });

        modelBuilder.Entity<ChatSession>(e =>
        {
            e.HasKey(x => x.ChatId);
            e.HasOne(x => x.User).WithMany(u => u.ChatSessions).HasForeignKey(x => x.UserId);
            e.HasOne(x => x.Chatbot).WithMany(c => c.ChatSessions).HasForeignKey(x => x.ChatbotId);
        });

        modelBuilder.Entity<PlantImage>(e =>
        {
            e.HasKey(x => x.ImageId);
            e.HasOne(x => x.Plant).WithMany(p => p.PlantImages).HasForeignKey(x => x.PlantId);
            e.HasOne(x => x.User).WithMany(u => u.PlantImages).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<SoilData>(e =>
        {
            e.HasKey(x => x.SoilId);
            e.HasOne(x => x.Plant).WithMany(p => p.SoilDataRecords).HasForeignKey(x => x.PlantId);
            e.Property(x => x.MoistureLevel).HasPrecision(18, 2);
            e.Property(x => x.Nitrogen).HasPrecision(18, 2);
            e.Property(x => x.PhLevel).HasPrecision(18, 2);
            e.Property(x => x.Phosphorus).HasPrecision(18, 2);
            e.Property(x => x.Potassium).HasPrecision(18, 2);
        });

        modelBuilder.Entity<UserChat>(e =>
        {
            e.HasKey(x => new { x.UserId, x.ChatId });
            e.HasOne(x => x.User).WithMany(u => u.UserChats).HasForeignKey(x => x.UserId);
            e.HasOne(x => x.ChatSession).WithMany(c => c.UserChats).HasForeignKey(x => x.ChatId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<Diagnosis>(e =>
        {
            e.HasKey(x => x.DiagnosisId);
            e.HasOne(x => x.PlantImage).WithMany(p => p.Diagnoses).HasForeignKey(x => x.ImageId);
            e.HasOne(x => x.Disease).WithMany(d => d.Diagnoses).HasForeignKey(x => x.DiseaseId);
        });

        modelBuilder.Entity<UserPlantImage>(e =>
        {
            e.HasKey(x => new { x.UserId, x.ImageId });
            e.HasOne(x => x.User).WithMany(u => u.UserPlantImages).HasForeignKey(x => x.UserId);
            e.HasOne(x => x.PlantImage).WithMany(p => p.UserPlantImages).HasForeignKey(x => x.ImageId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<Report>(e =>
        {
            e.HasKey(x => x.ReportId);
            e.HasOne(x => x.Diagnosis).WithMany(d => d.Reports).HasForeignKey(x => x.DiagnosisId);
            e.HasOne(x => x.Chatbot).WithMany(c => c.Reports).HasForeignKey(x => x.ChatbotId);
            e.HasOne(x => x.Manager).WithMany(u => u.ReportsAsManager).HasForeignKey(x => x.ManagerId);
            e.Property(x => x.ReportType).HasMaxLength(50);
        });
    }
}
