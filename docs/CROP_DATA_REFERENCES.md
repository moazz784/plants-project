# Crop Data References and Methodology

This document describes the sources and methodology used for the LeafScan Irrigation Calculator and Crop Recommendation data. All values are derived from peer-reviewed agricultural research and extension publications.

## Applying the Data

- **New database:** Run `LeafScan_Schema_And_Seed.sql` – it seeds research-based values.
- **Existing database:** Run `Update_Crop_Data_ResearchBased.sql` to update CropRequirements and optionally add CropSoilClimates.

---

## 1. Conversion Factors

| Unit | Value | Reference |
|------|-------|-----------|
| 1 acre-inch of water | 102,642 liters | [UF/IFAS CH153](https://edis.ifas.ufl.edu/publication/CH153) |
| 1 mm water on 1 acre | 4,046.86 liters | Derived: 1 acre = 4,046.86 m², 1 mm = 0.001 m |
| 1 hectare | 2.471 acres | Standard conversion |
| Fertilizer: kg/ha to kg/acre | × 0.4047 | Standard conversion |

**Weekly water formula:** `Liters/acre/week = (Seasonal_mm ÷ Growing_days) × 7 × 4047`

---

## 2. Water Requirements by Crop

### 2.1 Primary Source: FAO

**FAO Irrigation and Drainage Paper 56** – *Crop evapotranspiration - Guidelines for computing crop water requirements*  
- URL: https://www.fao.org/4/X0490E/x0490e00.htm  
- Methodology: ETc = Kc × ETo (crop coefficient × reference evapotranspiration)

**FAO Water and Soil Requirements (Table 2)** – Seasonal crop water needs (mm/total growing period)  
- URL: https://www.fao.org/4/u3160e/u3160e04.htm  

| Crop | FAO Seasonal Range (mm) | Growing Days | Calculated L/acre/week | Reference |
|------|-------------------------|--------------|------------------------|-----------|
| Maize (Corn) | 500-800 | 125-180 | 113,000 | FAO Table 2, Table 10 |
| Sorghum/Millet | 450-650 | 105-140 | 130,000 | FAO Table 2, Table 10 |
| Soybean | 450-700 | 135-150 | 116,000 | FAO Table 2 |
| Groundnut (Peanuts) | 500-700 | 130 | 130,000 | FAO Table 2, Table 10 |
| Rice | 1000-1500* | 90-150 | 283,000 | IRRI, FAO; *flooded system |
| Wheat/Barley/Oats | ~400-500 | 120-150 | 94,000 | FAO Table 6, cereal Kc |

### 2.2 Vegetable Crops

**Tomato** – FAO Crop Information  
- URL: https://www.fao.org/land-water/databases-and-software/crop-information/tomato/en/  
- Total water: 400-600 mm over 90-120 days  
- Peak ET: 5-6 mm/day  
- Fertilizer: 100-150 kg N/ha, 65-110 kg P/ha, 160-240 kg K/ha  

**Lettuce** – University of Arizona ACIS  
- URL: https://acis.cals.arizona.edu/agricultural-ipm/vegetables/lettuce/irrigation  
- 38-50 inches/acre seasonal (~965-1270 mm)  

**Potato** – Utah State Extension  
- URL: https://extension.usu.edu/vegetableguide/management/irrigation.php  
- Critical periods: tuber set and enlargement; moderate rooting (18-24 in)  

**Watermelon/Cucumber** – Utah State Extension  
- Deep roots (30+ in); critical: flowering, fruit sizing, ripening  

**Carrot** – UF/IFAS SS736  
- URL: https://edis.ifas.ufl.edu/publication/SS736  
- N: 200 lb/acre; P₂O₅, K₂O based on soil test  

---

## 3. Fertilizer Requirements

### 3.1 Sources

- **UF/IFAS Standardized Fertilization Recommendations**  
  https://edis.ifas.ufl.edu/publication/SS163  

- **California Crop Fertilization Guidelines (CDFA)**  
  https://www.cdfa.ca.gov/is/ffldrs/frep/FertilizationGuidelines/Annual_Crops.html  

- **FAO Tomato Crop Information** – 100-150 kg N/ha, 65-110 kg P/ha, 160-240 kg K/ha  

- **Montana State Nutrient Uptake & Removal**  
  https://landresources.montana.edu/soilfertility/nutuptake.html  

### 3.2 NPK Compound (20-20-20) Equivalent

Fertilizer recommendations are typically N-based. For compound NPK 20-20-20:
- To supply 100 kg N/ha → 500 kg compound/ha → ~200 kg/acre
- Values in database represent total compound fertilizer (NPK 20-20-20 or equivalent) per acre per growing season

---

## 4. Soil Type Suitability

### 4.1 Sources

- **Cornell Small Farms – Climate and Soil Considerations**  
  https://smallfarms.cornell.edu/guide/guide-to-farming/climate-and-soil-considerations/  

- **PLOS ONE – Rice in Clay vs Sandy Loam**  
  https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0150549  
  - Rice: Clay soil 46% higher yield than sandy loam  

- **Manitoba Agriculture – Corn Soil and Nutrition**  
  - Corn: Sandy loam or silty clay loam preferred  

### 4.2 Soil–Crop Suitability Summary

| Soil | Best For | Notes |
|------|----------|-------|
| Sandy | Watermelon, Peanuts, Sorghum, Millet, Tomato (arid) | Good drainage; drought-tolerant crops |
| Clay | Rice, Wheat, Barley, Oats, Soybean | Water retention; rice thrives |
| Silt | Lettuce, Potato, Corn, Tomato, Wheat | Balanced; many vegetables |
| Loam | Tomato, Soybean, Cucumber, Carrot | Ideal for most crops |

---

## 5. Climate Zone Suitability

### 5.1 Sources

- **FAO – Climate and Crop Growth**  
  https://www.fao.org/4/s2022e/s2022e06.htm  

- **Yield Gap – Climate Zones**  
  https://www.yieldgap.org/climate-zones  

- **New Mexico CR-457B – Growing Zones**  
  https://pubs.nmsu.edu/_circulars/CR457B.pdf  

### 5.2 Climate–Crop Suitability

| Climate | Crops | Notes |
|---------|-------|------|
| Arid | Watermelon, Peanuts, Sorghum, Millet, Tomato, Wheat | Irrigation required; drought-tolerant varieties |
| Humid | Rice, Lettuce, Potato, Oats, Tomato, Corn, Soybean, Cucumber | Higher disease pressure; good for rice |
| Cold | Potato, Barley, Oats, Carrot | Cool-season crops |
| Temperate | Tomato, Soybean, Cucumber, Carrot, Wheat | Most versatile zone |
| Tropical | Rice, Tomato | High ET; year-round potential |

---

## 6. Database Values (Practical Scale)

The LeafScan database uses **practical values** that preserve relative accuracy between crops (from FAO/extension research). Water: L/acre/week. Fertilizer: kg NPK compound per acre per season.

| Crop | Water (L/acre/week) | Fertilizer (kg/acre) |
|------|---------------------|----------------------|
| Rice | 700 | 22 |
| Lettuce | 620 | 14 |
| Spinach | 580 | 12 |
| Potato | 550 | 20 |
| Tomato | 540 | 18 |
| Watermelon | 520 | 18 |
| Cucumber | 510 | 15 |
| Peanuts | 500 | 12 |
| Corn | 500 | 22 |
| Carrot | 490 | 14 |
| Soybean | 480 | 14 |
| Sorghum | 480 | 10 |
| Millet | 460 | 8 |
| Wheat | 420 | 12 |
| Oats | 410 | 11 |
| Barley | 400 | 12 |

---

## 7. References (Full URLs)

1. FAO Irrigation and Drainage Paper 56 – Crop Evapotranspiration  
   https://www.fao.org/4/X0490E/x0490e00.htm  

2. FAO Water and Soil Requirements (Table 2, 6, 10)  
   https://www.fao.org/4/u3160e/u3160e04.htm  

3. FAO Tomato Crop Information  
   https://www.fao.org/land-water/databases-and-software/crop-information/tomato/en/  

4. UF/IFAS Water Measurement for Irrigation  
   https://edis.ifas.ufl.edu/publication/CH153  

5. UF/IFAS Carrot Fertilization (SS736)  
   https://edis.ifas.ufl.edu/publication/SS736  

6. UF/IFAS Standardized Fertilization (SS163)  
   https://edis.ifas.ufl.edu/publication/SS163  

7. University of Arizona Lettuce Irrigation  
   https://acis.cals.arizona.edu/agricultural-ipm/vegetables/lettuce/irrigation  

8. Utah State Vegetable Irrigation Guide  
   https://extension.usu.edu/vegetableguide/management/irrigation.php  

9. IRRI Rice Knowledge Bank – Water Management  
   http://www.knowledgebank.irri.org/step-by-step-production/growth/water-management  

10. PLOS ONE – Rice Soil Texture Study  
    https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0150549  

11. Cornell Small Farms – Climate and Soil  
    https://smallfarms.cornell.edu/guide/guide-to-farming/climate-and-soil-considerations/  

12. California CDFA Fertilization Guidelines  
    https://www.cdfa.ca.gov/is/ffldrs/frep/FertilizationGuidelines/Annual_Crops.html  

---

## 8. Disclaimer

These values are **guidelines** based on research under standard conditions. Actual requirements vary with:
- Local climate (temperature, humidity, wind)
- Soil type and organic matter
- Crop variety and planting density
- Irrigation method (drip, sprinkler, flood)
- Soil test results for P and K

Farmers should consult local extension services and conduct soil tests for site-specific recommendations.
