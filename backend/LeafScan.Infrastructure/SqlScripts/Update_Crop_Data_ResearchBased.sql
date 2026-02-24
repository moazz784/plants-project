-- =====================================================
-- LeafScan: Update Crop Data with Research-Based Values
-- =====================================================
-- Sources: FAO, UF/IFAS, IRRI, University Extension
-- See: docs/CROP_DATA_REFERENCES.md for full references
-- =====================================================

-- Update CropRequirements with practical values (relative accuracy from FAO/extension)
-- Water: Liters per acre per week. Fertilizer: Kg NPK compound per acre per season

UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 520, [FertilizerKgPerAcre] = 18 WHERE [CropId] = 1;  -- Watermelon
UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 500, [FertilizerKgPerAcre] = 12 WHERE [CropId] = 2;  -- Peanuts
UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 480, [FertilizerKgPerAcre] = 10 WHERE [CropId] = 3;  -- Sorghum
UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 460, [FertilizerKgPerAcre] = 8  WHERE [CropId] = 4;  -- Millet
UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 700, [FertilizerKgPerAcre] = 22 WHERE [CropId] = 5;  -- Rice
UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 620, [FertilizerKgPerAcre] = 14 WHERE [CropId] = 6;  -- Lettuce
UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 580, [FertilizerKgPerAcre] = 12 WHERE [CropId] = 7;  -- Spinach
UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 550, [FertilizerKgPerAcre] = 20 WHERE [CropId] = 8;  -- Potato
UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 400, [FertilizerKgPerAcre] = 12 WHERE [CropId] = 9;  -- Barley
UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 410, [FertilizerKgPerAcre] = 11 WHERE [CropId] = 10; -- Oats
UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 540, [FertilizerKgPerAcre] = 18 WHERE [CropId] = 11; -- Tomato
UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 420, [FertilizerKgPerAcre] = 12 WHERE [CropId] = 12; -- Wheat
UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 500, [FertilizerKgPerAcre] = 22 WHERE [CropId] = 13; -- Corn
UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 480, [FertilizerKgPerAcre] = 14 WHERE [CropId] = 14; -- Soybean
UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 510, [FertilizerKgPerAcre] = 15 WHERE [CropId] = 15; -- Cucumber
UPDATE [dbo].[CropRequirements] SET [WaterLitersPerAcrePerWeek] = 490, [FertilizerKgPerAcre] = 14 WHERE [CropId] = 16; -- Carrot

GO

-- =====================================================
-- Extended CropSoilClimates (research-based suitability)
-- See docs/CROP_DATA_REFERENCES.md Section 4 & 5
-- =====================================================

IF NOT EXISTS (SELECT 1 FROM [dbo].[CropSoilClimates] WHERE CropId=1 AND SoilTypeId=4 AND ClimateId=4)
    INSERT INTO [dbo].[CropSoilClimates] ([CropId],[SoilTypeId],[ClimateId]) VALUES (1,4,4);
IF NOT EXISTS (SELECT 1 FROM [dbo].[CropSoilClimates] WHERE CropId=1 AND SoilTypeId=4 AND ClimateId=5)
    INSERT INTO [dbo].[CropSoilClimates] ([CropId],[SoilTypeId],[ClimateId]) VALUES (1,4,5);
IF NOT EXISTS (SELECT 1 FROM [dbo].[CropSoilClimates] WHERE CropId=2 AND SoilTypeId=4 AND ClimateId=4)
    INSERT INTO [dbo].[CropSoilClimates] ([CropId],[SoilTypeId],[ClimateId]) VALUES (2,4,4);
IF NOT EXISTS (SELECT 1 FROM [dbo].[CropSoilClimates] WHERE CropId=2 AND SoilTypeId=4 AND ClimateId=5)
    INSERT INTO [dbo].[CropSoilClimates] ([CropId],[SoilTypeId],[ClimateId]) VALUES (2,4,5);
IF NOT EXISTS (SELECT 1 FROM [dbo].[CropSoilClimates] WHERE CropId=13 AND SoilTypeId=4 AND ClimateId=4)
    INSERT INTO [dbo].[CropSoilClimates] ([CropId],[SoilTypeId],[ClimateId]) VALUES (13,4,4);
IF NOT EXISTS (SELECT 1 FROM [dbo].[CropSoilClimates] WHERE CropId=14 AND SoilTypeId=4 AND ClimateId=5)
    INSERT INTO [dbo].[CropSoilClimates] ([CropId],[SoilTypeId],[ClimateId]) VALUES (14,4,5);
IF NOT EXISTS (SELECT 1 FROM [dbo].[CropSoilClimates] WHERE CropId=16 AND SoilTypeId=4 AND ClimateId=4)
    INSERT INTO [dbo].[CropSoilClimates] ([CropId],[SoilTypeId],[ClimateId]) VALUES (16,4,4);

GO
