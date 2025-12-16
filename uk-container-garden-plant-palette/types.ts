export enum PlantCategory {
  FlowersPerennials = "Flowers & Perennials",
  Herbs = "Herbs",
  Shrubs = "Shrubs",
  SmallTrees = "Small Trees",
  BulbsSpring = "Spring Bulbs",
  BulbsSummer = "Summer/Autumn Bulbs",
  Grasses = "Grasses",
  Ferns = "Ferns",
  Succulents = "Succulents",
  Climbers = "Vines & Climbers",
  ClimbersLarge = "Large Climbers (5m+)"
}

export enum LightRequirement {
  Sun = "Sun",
  PartialShade = "Partial Shade",
  Shade = "Shade"
}

export enum FoliageType {
  Evergreen = "Evergreen",
  SemiEvergreen = "Semi-evergreen",
  Deciduous = "Deciduous",
  Biennial = "Biennial",
  Annual = "Annual/Tender"
}

export enum SoilType {
  Moist = "Moist/Damp",
  WellDrained = "Well Drained",
  Gritty = "Gritty/Sandy",
  Ericaceous = "Acidic/Ericaceous",
  Fertile = "Rich/Fertile"
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  category: PlantCategory;
  native: boolean; // Simplified for filtering: True if native to UK
  nativeDetails: string; // The specific text from the doc (e.g. "No - Mediterranean")
  foliage: FoliageType;
  dimensions: string;
  appearance: string;
  conditions: string;
  lightTags: LightRequirement[]; // Parsed from conditions for easier filtering
  soilTags: SoilType[]; // Parsed from conditions for easier filtering
  ecologicalImportance: string;
  limitations?: string; // For the "With limitations" lists
  notRecommended?: boolean; // For plants not recommended for containers
}