using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LeafScan.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCropServices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Climates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Climates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Crops",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Crops", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SoilTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoilTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CropRequirements",
                columns: table => new
                {
                    CropId = table.Column<int>(type: "int", nullable: false),
                    WaterLitersPerAcrePerWeek = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    FertilizerKgPerAcre = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CropRequirements", x => x.CropId);
                    table.ForeignKey(
                        name: "FK_CropRequirements_Crops_CropId",
                        column: x => x.CropId,
                        principalTable: "Crops",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CropSoilClimates",
                columns: table => new
                {
                    CropId = table.Column<int>(type: "int", nullable: false),
                    SoilTypeId = table.Column<int>(type: "int", nullable: false),
                    ClimateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CropSoilClimates", x => new { x.CropId, x.SoilTypeId, x.ClimateId });
                    table.ForeignKey(
                        name: "FK_CropSoilClimates_Climates_ClimateId",
                        column: x => x.ClimateId,
                        principalTable: "Climates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CropSoilClimates_Crops_CropId",
                        column: x => x.CropId,
                        principalTable: "Crops",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CropSoilClimates_SoilTypes_SoilTypeId",
                        column: x => x.SoilTypeId,
                        principalTable: "SoilTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CropSoilClimates_ClimateId",
                table: "CropSoilClimates",
                column: "ClimateId");

            migrationBuilder.CreateIndex(
                name: "IX_CropSoilClimates_SoilTypeId",
                table: "CropSoilClimates",
                column: "SoilTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CropRequirements");

            migrationBuilder.DropTable(
                name: "CropSoilClimates");

            migrationBuilder.DropTable(
                name: "Climates");

            migrationBuilder.DropTable(
                name: "Crops");

            migrationBuilder.DropTable(
                name: "SoilTypes");
        }
    }
}
