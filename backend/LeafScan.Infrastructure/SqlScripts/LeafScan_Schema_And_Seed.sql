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

-- Record migrations so EF skips them
IF NOT EXISTS (SELECT 1 FROM [dbo].[__EFMigrationsHistory] WHERE [MigrationId] = N'20260213180817_InitialCreate')
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260213180817_InitialCreate', N'8.0.11');
IF NOT EXISTS (SELECT 1 FROM [dbo].[__EFMigrationsHistory] WHERE [MigrationId] = N'20260213190000_AddErDiagramTables')
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260213190000_AddErDiagramTables', N'8.0.11');
IF NOT EXISTS (SELECT 1 FROM [dbo].[__EFMigrationsHistory] WHERE [MigrationId] = N'20260221120000_AddCropServices')
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260221120000_AddCropServices', N'8.0.11');
IF NOT EXISTS (SELECT 1 FROM [dbo].[__EFMigrationsHistory] WHERE [MigrationId] = N'20260224164004_AddTranslationTables')
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260224164004_AddTranslationTables', N'8.0.11');
GO

-- =====================================================
-- 14. Crop Services tables (SoilTypes, Climates, Crops, CropSoilClimates, CropRequirements)
-- Used by Irrigation Calculator and Crop Recommendation APIs
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SoilTypes')
BEGIN
    CREATE TABLE [dbo].[SoilTypes] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Name] NVARCHAR(50) NOT NULL,
        CONSTRAINT [PK_SoilTypes] PRIMARY KEY ([Id])
    );

    CREATE TABLE [dbo].[Climates] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Name] NVARCHAR(50) NOT NULL,
        CONSTRAINT [PK_Climates] PRIMARY KEY ([Id])
    );

    CREATE TABLE [dbo].[Crops] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Name] NVARCHAR(100) NOT NULL,
        CONSTRAINT [PK_Crops] PRIMARY KEY ([Id])
    );

    CREATE TABLE [dbo].[CropSoilClimates] (
        [CropId] INT NOT NULL,
        [SoilTypeId] INT NOT NULL,
        [ClimateId] INT NOT NULL,
        CONSTRAINT [PK_CropSoilClimates] PRIMARY KEY ([CropId], [SoilTypeId], [ClimateId]),
        CONSTRAINT [FK_CropSoilClimates_Crops_CropId] FOREIGN KEY ([CropId]) REFERENCES [dbo].[Crops] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_CropSoilClimates_SoilTypes_SoilTypeId] FOREIGN KEY ([SoilTypeId]) REFERENCES [dbo].[SoilTypes] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_CropSoilClimates_Climates_ClimateId] FOREIGN KEY ([ClimateId]) REFERENCES [dbo].[Climates] ([Id]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_CropSoilClimates_ClimateId] ON [dbo].[CropSoilClimates] ([ClimateId]);
    CREATE INDEX [IX_CropSoilClimates_SoilTypeId] ON [dbo].[CropSoilClimates] ([SoilTypeId]);

    CREATE TABLE [dbo].[CropRequirements] (
        [CropId] INT NOT NULL,
        [WaterLitersPerAcrePerWeek] DECIMAL(18,2) NOT NULL,
        [FertilizerKgPerAcre] DECIMAL(18,2) NOT NULL,
        CONSTRAINT [PK_CropRequirements] PRIMARY KEY ([CropId]),
        CONSTRAINT [FK_CropRequirements_Crops_CropId] FOREIGN KEY ([CropId]) REFERENCES [dbo].[Crops] ([Id]) ON DELETE CASCADE
    );
-- Seed SoilTypes (4), Climates (5), Crops (16), CropSoilClimates, CropRequirements (16 - all crops)
-- Only seed when empty (for manual SQL deployments; EF migrations + Program.cs handle API deployments)
IF NOT EXISTS (SELECT 1 FROM [dbo].[SoilTypes])
BEGIN
    SET IDENTITY_INSERT [dbo].[SoilTypes] ON;
    INSERT INTO [dbo].[SoilTypes] ([Id], [Name]) VALUES (1,'Sandy'),(2,'Clay'),(3,'Silt'),(4,'Loam');
    SET IDENTITY_INSERT [dbo].[SoilTypes] OFF;

    SET IDENTITY_INSERT [dbo].[Climates] ON;
    INSERT INTO [dbo].[Climates] ([Id], [Name]) VALUES (1,'Arid'),(2,'Humid'),(3,'Cold'),(4,'Temperate'),(5,'Tropical');
    SET IDENTITY_INSERT [dbo].[Climates] OFF;

    SET IDENTITY_INSERT [dbo].[Crops] ON;
    INSERT INTO [dbo].[Crops] ([Id], [Name]) VALUES
    (1,'Watermelon'),(2,'Peanuts'),(3,'Sorghum'),(4,'Millet'),(5,'Rice'),(6,'Lettuce'),(7,'Spinach'),(8,'Potato'),
    (9,'Barley'),(10,'Oats'),(11,'Tomato'),(12,'Wheat'),(13,'Corn'),(14,'Soybean'),(15,'Cucumber'),(16,'Carrot');
    SET IDENTITY_INSERT [dbo].[Crops] OFF;

    INSERT INTO [dbo].[CropSoilClimates] ([CropId],[SoilTypeId],[ClimateId]) VALUES
    (1,1,1),(2,1,1),(3,1,1),(4,1,1),(5,2,2),(5,2,5),(6,3,2),(7,3,3),(8,1,3),(8,1,2),(8,3,3),(8,3,2),
    (9,2,3),(10,2,3),(10,2,2),(10,3,3),(10,3,2),(11,1,1),(11,1,2),(11,3,1),(11,3,2),(11,4,4),(11,4,5),
    (12,2,1),(12,2,3),(12,3,1),(12,3,3),(13,3,2),(13,2,2),(14,4,4),(14,2,2),(15,4,4),(15,1,2),(16,1,4),(16,4,3);

    -- Practical values (relative accuracy from FAO/extension). Water L/acre/week, Fertilizer kg/acre
    INSERT INTO [dbo].[CropRequirements] ([CropId],[WaterLitersPerAcrePerWeek],[FertilizerKgPerAcre]) VALUES
    (1,520,18),(2,500,12),(3,480,10),(4,460,8),(5,700,22),(6,620,14),(7,580,12),(8,550,20),
    (9,400,12),(10,410,11),(11,540,18),(12,420,12),(13,500,22),(14,480,14),(15,510,15),(16,490,14);
END
GO

-- 15. Translation tables for localization (en/ar)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SoilTypeTranslations')
BEGIN
    CREATE TABLE [dbo].[SoilTypeTranslations] (
        [SoilTypeId] INT NOT NULL,
        [LanguageCode] NVARCHAR(10) NOT NULL,
        [Name] NVARCHAR(100) NOT NULL,
        CONSTRAINT [PK_SoilTypeTranslations] PRIMARY KEY ([SoilTypeId], [LanguageCode]),
        CONSTRAINT [FK_SoilTypeTranslations_SoilTypes_SoilTypeId] FOREIGN KEY ([SoilTypeId]) REFERENCES [dbo].[SoilTypes] ([Id]) ON DELETE CASCADE
    );
    CREATE TABLE [dbo].[ClimateTranslations] (
        [ClimateId] INT NOT NULL,
        [LanguageCode] NVARCHAR(10) NOT NULL,
        [Name] NVARCHAR(100) NOT NULL,
        CONSTRAINT [PK_ClimateTranslations] PRIMARY KEY ([ClimateId], [LanguageCode]),
        CONSTRAINT [FK_ClimateTranslations_Climates_ClimateId] FOREIGN KEY ([ClimateId]) REFERENCES [dbo].[Climates] ([Id]) ON DELETE CASCADE
    );
    CREATE TABLE [dbo].[CropTranslations] (
        [CropId] INT NOT NULL,
        [LanguageCode] NVARCHAR(10) NOT NULL,
        [Name] NVARCHAR(100) NOT NULL,
        CONSTRAINT [PK_CropTranslations] PRIMARY KEY ([CropId], [LanguageCode]),
        CONSTRAINT [FK_CropTranslations_Crops_CropId] FOREIGN KEY ([CropId]) REFERENCES [dbo].[Crops] ([Id]) ON DELETE CASCADE
    );
END
GO

-- Seed translation tables (en + ar) when empty
IF NOT EXISTS (SELECT 1 FROM [dbo].[SoilTypeTranslations])
BEGIN
    INSERT INTO [dbo].[SoilTypeTranslations] ([SoilTypeId],[LanguageCode],[Name]) VALUES
    (1,'en','Sandy'),(1,'ar',N'رملية'),(2,'en','Clay'),(2,'ar',N'طينية'),(3,'en','Silt'),(3,'ar',N'غرينية'),(4,'en','Loam'),(4,'ar',N'طمي');
    INSERT INTO [dbo].[ClimateTranslations] ([ClimateId],[LanguageCode],[Name]) VALUES
    (1,'en','Arid'),(1,'ar',N'قاحل'),(2,'en','Humid'),(2,'ar',N'رطب'),(3,'en','Cold'),(3,'ar',N'بارد'),(4,'en','Temperate'),(4,'ar',N'معتدل'),(5,'en','Tropical'),(5,'ar',N'استوائي');
    INSERT INTO [dbo].[CropTranslations] ([CropId],[LanguageCode],[Name]) VALUES
    (1,'en','Watermelon'),(1,'ar',N'بطيخ'),(2,'en','Peanuts'),(2,'ar',N'فول سوداني'),(3,'en','Sorghum'),(3,'ar',N'ذرة بيضاء'),(4,'en','Millet'),(4,'ar',N'دخن'),(5,'en','Rice'),(5,'ar',N'أرز'),(6,'en','Lettuce'),(6,'ar',N'خس'),(7,'en','Spinach'),(7,'ar',N'سبانخ'),(8,'en','Potato'),(8,'ar',N'بطاطا'),(9,'en','Barley'),(9,'ar',N'شعير'),(10,'en','Oats'),(10,'ar',N'شوفان'),(11,'en','Tomato'),(11,'ar',N'طماطم'),(12,'en','Wheat'),(12,'ar',N'قمح'),(13,'en','Corn'),(13,'ar',N'ذرة'),(14,'en','Soybean'),(14,'ar',N'فول صويا'),(15,'en','Cucumber'),(15,'ar',N'خيار'),(16,'en','Carrot'),(16,'ar',N'جزر');
END
GO

-- Patch: Add CropRequirements for ALL 16 crops if missing (idempotent)
INSERT INTO [dbo].[CropRequirements] ([CropId],[WaterLitersPerAcrePerWeek],[FertilizerKgPerAcre])
SELECT v.CropId, v.Water, v.Fertilizer
FROM (VALUES 
    (1, 520.00, 18.00), (2, 500.00, 12.00), (3, 480.00, 10.00), (4, 460.00, 8.00), (5, 700.00, 22.00),
    (6, 620.00, 14.00), (7, 580.00, 12.00), (8, 550.00, 20.00), (9, 400.00, 12.00), (10, 410.00, 11.00),
    (11, 540.00, 18.00), (12, 420.00, 12.00), (13, 500.00, 22.00), (14, 480.00, 14.00), (15, 510.00, 15.00), (16, 490.00, 14.00)
) AS v(CropId, Water, Fertilizer)
WHERE EXISTS (SELECT 1 FROM [dbo].[Crops] c WHERE c.Id = v.CropId)
AND NOT EXISTS (SELECT 1 FROM [dbo].[CropRequirements] cr WHERE cr.CropId = v.CropId);
GO

-- =====================================================
-- NOTE: All data is managed in the database. No seed data in application code.
-- Manager/Admin = Users with Role='Admin' (report.ManagerId references Users)
-- =====================================================
