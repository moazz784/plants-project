using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LeafScan.Infrastructure.Migrations
{
    public partial class AddErDiagramTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Diseases",
                columns: table => new
                {
                    DiseaseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DiseaseName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Symptoms = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SeverityLevel = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table => table.PrimaryKey("PK_Diseases", x => x.DiseaseId));

            migrationBuilder.CreateTable(
                name: "AiChatbots",
                columns: table => new
                {
                    ChatbotId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Capabilities = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModelVersion = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table => table.PrimaryKey("PK_AiChatbots", x => x.ChatbotId));

            migrationBuilder.CreateTable(
                name: "Plants",
                columns: table => new
                {
                    PlantId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlantName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Species = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SoilType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plants", x => x.PlantId);
                    table.ForeignKey(
                        name: "FK_Plants_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChatSessions",
                columns: table => new
                {
                    ChatId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Messages = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Reply = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ChatbotId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatSessions", x => x.ChatId);
                    table.ForeignKey(
                        name: "FK_ChatSessions_AiChatbots_ChatbotId",
                        column: x => x.ChatbotId,
                        principalTable: "AiChatbots",
                        principalColumn: "ChatbotId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatSessions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlantImages",
                columns: table => new
                {
                    ImageId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UploadDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PlantId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlantImages", x => x.ImageId);
                    table.ForeignKey(
                        name: "FK_PlantImages_Plants_PlantId",
                        column: x => x.PlantId,
                        principalTable: "Plants",
                        principalColumn: "PlantId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlantImages_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "SoilData",
                columns: table => new
                {
                    SoilId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MoistureLevel = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PhLevel = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Nitrogen = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Phosphorus = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Potassium = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PlantId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoilData", x => x.SoilId);
                    table.ForeignKey(
                        name: "FK_SoilData_Plants_PlantId",
                        column: x => x.PlantId,
                        principalTable: "Plants",
                        principalColumn: "PlantId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserChats",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ChatId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserChats", x => new { x.UserId, x.ChatId });
                    table.ForeignKey(
                        name: "FK_UserChats_ChatSessions_ChatId",
                        column: x => x.ChatId,
                        principalTable: "ChatSessions",
                        principalColumn: "ChatId",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_UserChats_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Diagnoses",
                columns: table => new
                {
                    DiagnosisId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DiagnosedByAi = table.Column<bool>(type: "bit", nullable: false),
                    DiagnosedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ImageId = table.Column<int>(type: "int", nullable: false),
                    DiseaseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Diagnoses", x => x.DiagnosisId);
                    table.ForeignKey(
                        name: "FK_Diagnoses_Diseases_DiseaseId",
                        column: x => x.DiseaseId,
                        principalTable: "Diseases",
                        principalColumn: "DiseaseId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Diagnoses_PlantImages_ImageId",
                        column: x => x.ImageId,
                        principalTable: "PlantImages",
                        principalColumn: "ImageId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserPlantImages",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ImageId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPlantImages", x => new { x.UserId, x.ImageId });
                    table.ForeignKey(
                        name: "FK_UserPlantImages_PlantImages_ImageId",
                        column: x => x.ImageId,
                        principalTable: "PlantImages",
                        principalColumn: "ImageId",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_UserPlantImages_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    ReportId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GeneratedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReportType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DiagnosisId = table.Column<int>(type: "int", nullable: true),
                    ChatbotId = table.Column<int>(type: "int", nullable: true),
                    ManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.ReportId);
                    table.ForeignKey(
                        name: "FK_Reports_AiChatbots_ChatbotId",
                        column: x => x.ChatbotId,
                        principalTable: "AiChatbots",
                        principalColumn: "ChatbotId");
                    table.ForeignKey(
                        name: "FK_Reports_Diagnoses_DiagnosisId",
                        column: x => x.DiagnosisId,
                        principalTable: "Diagnoses",
                        principalColumn: "DiagnosisId");
                    table.ForeignKey(
                        name: "FK_Reports_Users_ManagerId",
                        column: x => x.ManagerId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_ChatbotId",
                table: "ChatSessions",
                column: "ChatbotId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_UserId",
                table: "ChatSessions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PlantImages_PlantId",
                table: "PlantImages",
                column: "PlantId");

            migrationBuilder.CreateIndex(
                name: "IX_PlantImages_UserId",
                table: "PlantImages",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Plants_UserId",
                table: "Plants",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SoilData_PlantId",
                table: "SoilData",
                column: "PlantId");

            migrationBuilder.CreateIndex(
                name: "IX_UserChats_ChatId",
                table: "UserChats",
                column: "ChatId");

            migrationBuilder.CreateIndex(
                name: "IX_Diagnoses_DiseaseId",
                table: "Diagnoses",
                column: "DiseaseId");

            migrationBuilder.CreateIndex(
                name: "IX_Diagnoses_ImageId",
                table: "Diagnoses",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPlantImages_ImageId",
                table: "UserPlantImages",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_ChatbotId",
                table: "Reports",
                column: "ChatbotId");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_DiagnosisId",
                table: "Reports",
                column: "DiagnosisId");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_ManagerId",
                table: "Reports",
                column: "ManagerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "Reports");
            migrationBuilder.DropTable(name: "UserPlantImages");
            migrationBuilder.DropTable(name: "UserChats");
            migrationBuilder.DropTable(name: "Diagnoses");
            migrationBuilder.DropTable(name: "SoilData");
            migrationBuilder.DropTable(name: "PlantImages");
            migrationBuilder.DropTable(name: "ChatSessions");
            migrationBuilder.DropTable(name: "Plants");
            migrationBuilder.DropTable(name: "Diseases");
            migrationBuilder.DropTable(name: "AiChatbots");
        }
    }
}
