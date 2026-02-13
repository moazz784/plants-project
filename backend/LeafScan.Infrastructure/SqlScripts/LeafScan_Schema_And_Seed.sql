-- =====================================================
-- LeafScan Full Database Schema for SQL Server (monsterasp.net)
-- Matches ER diagram: Users, Messages, Disease, Plant, AiChatbot,
--   ChatSession, PlantImage, SoilData, UserChat, Diagnosis,
--   UserPlantImage, Report (manager = Admin via Users.Role)
-- Run in your database SQL tool (e.g. monsterasp.net SQL panel, SSMS)
-- =====================================================

-- 1. Users table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE [dbo].[Users] (
        [Id] UNIQUEIDENTIFIER NOT NULL,
        [Name] NVARCHAR(200) NOT NULL,
        [Email] NVARCHAR(450) NOT NULL,
        [PasswordHash] NVARCHAR(MAX) NOT NULL,
        [Role] NVARCHAR(20) NOT NULL,
        [ProfileImageBase64] NVARCHAR(MAX) NULL,
        [CreatedAtUtc] DATETIME2 NOT NULL,
        [UpdatedAtUtc] DATETIME2 NOT NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
    CREATE UNIQUE INDEX [IX_Users_Email] ON [dbo].[Users] ([Email]);
END
GO

-- 2. Messages table (contact form)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Messages')
BEGIN
    CREATE TABLE [dbo].[Messages] (
        [Id] UNIQUEIDENTIFIER NOT NULL,
        [SenderUserId] UNIQUEIDENTIFIER NOT NULL,
        [SenderFirstName] NVARCHAR(MAX) NOT NULL,
        [SenderLastName] NVARCHAR(MAX) NOT NULL,
        [SenderEmail] NVARCHAR(MAX) NOT NULL,
        [SenderPhone] NVARCHAR(MAX) NULL,
        [Body] NVARCHAR(MAX) NOT NULL,
        [Status] NVARCHAR(20) NOT NULL,
        [CreatedAtUtc] DATETIME2 NOT NULL,
        CONSTRAINT [PK_Messages] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Messages_Users_SenderUserId] FOREIGN KEY ([SenderUserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_Messages_CreatedAtUtc] ON [dbo].[Messages] ([CreatedAtUtc]);
    CREATE INDEX [IX_Messages_SenderUserId] ON [dbo].[Messages] ([SenderUserId]);
    CREATE INDEX [IX_Messages_Status] ON [dbo].[Messages] ([Status]);
END
GO

-- 3. Diseases table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Diseases')
BEGIN
    CREATE TABLE [dbo].[Diseases] (
        [DiseaseId] INT IDENTITY(1,1) NOT NULL,
        [DiseaseName] NVARCHAR(200) NOT NULL,
        [Symptoms] NVARCHAR(MAX) NULL,
        [SeverityLevel] NVARCHAR(50) NULL,
        CONSTRAINT [PK_Diseases] PRIMARY KEY ([DiseaseId])
    );
END
GO

-- 4. AiChatbots table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AiChatbots')
BEGIN
    CREATE TABLE [dbo].[AiChatbots] (
        [ChatbotId] INT IDENTITY(1,1) NOT NULL,
        [Capabilities] NVARCHAR(MAX) NULL,
        [ModelVersion] NVARCHAR(100) NULL,
        [LastUpdated] DATETIME2 NOT NULL,
        CONSTRAINT [PK_AiChatbots] PRIMARY KEY ([ChatbotId])
    );
END
GO

-- 5. Plants table (FK Users)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Plants')
BEGIN
    CREATE TABLE [dbo].[Plants] (
        [PlantId] INT IDENTITY(1,1) NOT NULL,
        [PlantName] NVARCHAR(200) NOT NULL,
        [Species] NVARCHAR(200) NULL,
        [SoilType] NVARCHAR(100) NULL,
        [UserId] UNIQUEIDENTIFIER NOT NULL,
        CONSTRAINT [PK_Plants] PRIMARY KEY ([PlantId]),
        CONSTRAINT [FK_Plants_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_Plants_UserId] ON [dbo].[Plants] ([UserId]);
END
GO

-- 6. ChatSessions table (FK Users, AiChatbots)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ChatSessions')
BEGIN
    CREATE TABLE [dbo].[ChatSessions] (
        [ChatId] INT IDENTITY(1,1) NOT NULL,
        [Messages] NVARCHAR(MAX) NULL,
        [Reply] NVARCHAR(MAX) NULL,
        [CreatedDate] DATETIME2 NOT NULL,
        [UserId] UNIQUEIDENTIFIER NOT NULL,
        [ChatbotId] INT NOT NULL,
        CONSTRAINT [PK_ChatSessions] PRIMARY KEY ([ChatId]),
        CONSTRAINT [FK_ChatSessions_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_ChatSessions_AiChatbots_ChatbotId] FOREIGN KEY ([ChatbotId]) REFERENCES [dbo].[AiChatbots] ([ChatbotId]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_ChatSessions_UserId] ON [dbo].[ChatSessions] ([UserId]);
    CREATE INDEX [IX_ChatSessions_ChatbotId] ON [dbo].[ChatSessions] ([ChatbotId]);
END
GO

-- 7. PlantImages table (FK Plants, Users)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PlantImages')
BEGIN
    CREATE TABLE [dbo].[PlantImages] (
        [ImageId] INT IDENTITY(1,1) NOT NULL,
        [ImageUrl] NVARCHAR(MAX) NULL,
        [UploadDate] DATETIME2 NOT NULL,
        [PlantId] INT NOT NULL,
        [UserId] UNIQUEIDENTIFIER NOT NULL,
        CONSTRAINT [PK_PlantImages] PRIMARY KEY ([ImageId]),
        CONSTRAINT [FK_PlantImages_Plants_PlantId] FOREIGN KEY ([PlantId]) REFERENCES [dbo].[Plants] ([PlantId]) ON DELETE CASCADE,
        CONSTRAINT [FK_PlantImages_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE NO ACTION
    );
    CREATE INDEX [IX_PlantImages_PlantId] ON [dbo].[PlantImages] ([PlantId]);
    CREATE INDEX [IX_PlantImages_UserId] ON [dbo].[PlantImages] ([UserId]);
END
GO

-- 8. SoilData table (FK Plants)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SoilData')
BEGIN
    CREATE TABLE [dbo].[SoilData] (
        [SoilId] INT IDENTITY(1,1) NOT NULL,
        [MoistureLevel] DECIMAL(18,2) NULL,
        [PhLevel] DECIMAL(18,2) NULL,
        [Nitrogen] DECIMAL(18,2) NULL,
        [Phosphorus] DECIMAL(18,2) NULL,
        [Potassium] DECIMAL(18,2) NULL,
        [PlantId] INT NOT NULL,
        CONSTRAINT [PK_SoilData] PRIMARY KEY ([SoilId]),
        CONSTRAINT [FK_SoilData_Plants_PlantId] FOREIGN KEY ([PlantId]) REFERENCES [dbo].[Plants] ([PlantId]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_SoilData_PlantId] ON [dbo].[SoilData] ([PlantId]);
END
GO

-- 9. UserChats junction table (FK Users, ChatSessions)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserChats')
BEGIN
    CREATE TABLE [dbo].[UserChats] (
        [UserId] UNIQUEIDENTIFIER NOT NULL,
        [ChatId] INT NOT NULL,
        CONSTRAINT [PK_UserChats] PRIMARY KEY ([UserId], [ChatId]),
        CONSTRAINT [FK_UserChats_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_UserChats_ChatSessions_ChatId] FOREIGN KEY ([ChatId]) REFERENCES [dbo].[ChatSessions] ([ChatId]) ON DELETE NO ACTION
    );
    CREATE INDEX [IX_UserChats_ChatId] ON [dbo].[UserChats] ([ChatId]);
END
GO

-- 10. Diagnoses table (FK PlantImages, Diseases)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Diagnoses')
BEGIN
    CREATE TABLE [dbo].[Diagnoses] (
        [DiagnosisId] INT IDENTITY(1,1) NOT NULL,
        [DiagnosedByAi] BIT NOT NULL,
        [DiagnosedDate] DATETIME2 NOT NULL,
        [ImageId] INT NOT NULL,
        [DiseaseId] INT NOT NULL,
        CONSTRAINT [PK_Diagnoses] PRIMARY KEY ([DiagnosisId]),
        CONSTRAINT [FK_Diagnoses_PlantImages_ImageId] FOREIGN KEY ([ImageId]) REFERENCES [dbo].[PlantImages] ([ImageId]) ON DELETE CASCADE,
        CONSTRAINT [FK_Diagnoses_Diseases_DiseaseId] FOREIGN KEY ([DiseaseId]) REFERENCES [dbo].[Diseases] ([DiseaseId]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_Diagnoses_ImageId] ON [dbo].[Diagnoses] ([ImageId]);
    CREATE INDEX [IX_Diagnoses_DiseaseId] ON [dbo].[Diagnoses] ([DiseaseId]);
END
GO

-- 11. UserPlantImages junction table (FK Users, PlantImages)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserPlantImages')
BEGIN
    CREATE TABLE [dbo].[UserPlantImages] (
        [UserId] UNIQUEIDENTIFIER NOT NULL,
        [ImageId] INT NOT NULL,
        CONSTRAINT [PK_UserPlantImages] PRIMARY KEY ([UserId], [ImageId]),
        CONSTRAINT [FK_UserPlantImages_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_UserPlantImages_PlantImages_ImageId] FOREIGN KEY ([ImageId]) REFERENCES [dbo].[PlantImages] ([ImageId]) ON DELETE NO ACTION
    );
    CREATE INDEX [IX_UserPlantImages_ImageId] ON [dbo].[UserPlantImages] ([ImageId]);
END
GO

-- 12. Reports table (FK Diagnoses, AiChatbots, Users as Manager/Admin)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Reports')
BEGIN
    CREATE TABLE [dbo].[Reports] (
        [ReportId] INT IDENTITY(1,1) NOT NULL,
        [Content] NVARCHAR(MAX) NULL,
        [GeneratedDate] DATETIME2 NOT NULL,
        [ReportType] NVARCHAR(50) NULL,
        [DiagnosisId] INT NULL,
        [ChatbotId] INT NULL,
        [ManagerId] UNIQUEIDENTIFIER NULL,
        CONSTRAINT [PK_Reports] PRIMARY KEY ([ReportId]),
        CONSTRAINT [FK_Reports_Diagnoses_DiagnosisId] FOREIGN KEY ([DiagnosisId]) REFERENCES [dbo].[Diagnoses] ([DiagnosisId]),
        CONSTRAINT [FK_Reports_AiChatbots_ChatbotId] FOREIGN KEY ([ChatbotId]) REFERENCES [dbo].[AiChatbots] ([ChatbotId]),
        CONSTRAINT [FK_Reports_Users_ManagerId] FOREIGN KEY ([ManagerId]) REFERENCES [dbo].[Users] ([Id])
    );
    CREATE INDEX [IX_Reports_DiagnosisId] ON [dbo].[Reports] ([DiagnosisId]);
    CREATE INDEX [IX_Reports_ChatbotId] ON [dbo].[Reports] ([ChatbotId]);
    CREATE INDEX [IX_Reports_ManagerId] ON [dbo].[Reports] ([ManagerId]);
END
GO

-- 13. EF migrations history (prevents EF from re-running migrations)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = '__EFMigrationsHistory')
BEGIN
    CREATE TABLE [dbo].[__EFMigrationsHistory] (
        [MigrationId] NVARCHAR(150) NOT NULL,
        [ProductVersion] NVARCHAR(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END
GO

-- Record both migrations so EF skips them
IF NOT EXISTS (SELECT 1 FROM [dbo].[__EFMigrationsHistory] WHERE [MigrationId] = N'20260213180817_InitialCreate')
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260213180817_InitialCreate', N'8.0.11');
IF NOT EXISTS (SELECT 1 FROM [dbo].[__EFMigrationsHistory] WHERE [MigrationId] = N'20260213190000_AddErDiagramTables')
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260213190000_AddErDiagramTables', N'8.0.11');
GO

-- =====================================================
-- NOTE: Admin user seeded on first API run.
-- Login: admin@leafscan.com / Admin@123
-- Manager/Admin = Users with Role='Admin' (report.ManagerId references Users)
-- =====================================================
