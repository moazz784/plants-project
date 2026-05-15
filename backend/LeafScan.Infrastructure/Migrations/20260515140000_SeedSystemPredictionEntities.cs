using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LeafScan.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedSystemPredictionEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Stable system user + plants for persisting anonymous / ML scans (see PredictionSystemIds).
            migrationBuilder.Sql("""
                DECLARE @SysUser UNIQUEIDENTIFIER = '00000000-0000-4000-8000-000000000001';

                IF NOT EXISTS (SELECT 1 FROM [Users] WHERE [Id] = @SysUser)
                INSERT INTO [Users] ([Id], [Name], [Email], [PasswordHash], [Role], [CreatedAtUtc], [UpdatedAtUtc])
                VALUES (
                    @SysUser,
                    N'System (anonymous scans)',
                    N'system-leafscan@internal.local',
                    N'$2b$11$sRkSztSclcAIZMCBJjmN0eAdobdpcx/2NRcDe.pmQeozJdTUXxFAS',
                    N'User',
                    SYSUTCDATETIME(),
                    SYSUTCDATETIME()
                );

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Default scan')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Default scan', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Tomato')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Tomato', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Potato')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Potato', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Pepper')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Pepper', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Apple')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Apple', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Grape')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Grape', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Corn')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Corn', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Cherry')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Cherry', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Peach')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Peach', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Soybean')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Soybean', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Squash')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Squash', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Strawberry')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Strawberry', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Raspberry')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Raspberry', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Blueberry')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Blueberry', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Orange')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Orange', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Cucumber')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Cucumber', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Lettuce')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Lettuce', NULL, NULL, @SysUser);

                IF NOT EXISTS (SELECT 1 FROM [Plants] WHERE [UserId] = @SysUser AND [PlantName] = N'Background')
                INSERT INTO [Plants] ([PlantName], [Species], [SoilType], [UserId]) VALUES (N'Background', NULL, NULL, @SysUser);
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DECLARE @SysUser UNIQUEIDENTIFIER = '00000000-0000-4000-8000-000000000001';

                DECLARE @PlantIds TABLE (Id INT PRIMARY KEY);
                INSERT INTO @PlantIds (Id)
                SELECT [PlantId] FROM [Plants] WHERE [UserId] = @SysUser;

                DELETE u FROM [UserPlantImages] u
                INNER JOIN [PlantImages] p ON p.[ImageId] = u.[ImageId]
                WHERE p.[PlantId] IN (SELECT Id FROM @PlantIds);

                DELETE r FROM [Reports] r
                INNER JOIN [Diagnoses] d ON d.[DiagnosisId] = r.[DiagnosisId]
                INNER JOIN [PlantImages] p ON p.[ImageId] = d.[ImageId]
                WHERE p.[PlantId] IN (SELECT Id FROM @PlantIds);

                DELETE FROM [Diagnoses] WHERE [ImageId] IN (
                    SELECT [ImageId] FROM [PlantImages] WHERE [PlantId] IN (SELECT Id FROM @PlantIds));

                DELETE FROM [PlantImages] WHERE [PlantId] IN (SELECT Id FROM @PlantIds);

                DELETE FROM [Plants] WHERE [UserId] = @SysUser;

                DELETE FROM [Users] WHERE [Id] = @SysUser;
                """);
        }
    }
}
