// ============================================================
// Accident Hotspot Prediction System — Types & Interfaces
// ============================================================

export type SeverityLevel = "fatal" | "serious" | "minor";

export type RiskLevel = "critical" | "high" | "moderate" | "low";

export type LightingCondition = "good" | "moderate" | "poor" | "none";

export type SurfaceCondition = "good" | "fair" | "poor";

export interface AccidentRecord {
  id: string;
  lat: number;
  lng: number;
  date: string;
  time: string;
  severity: SeverityLevel;
  vehicleType: string;
  roadType: string;
  cause: string;
  victims: number;
  description: string;
}

export interface HotspotZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // meters
  accidentCount: number;
  fatalityCount: number;
  kdeScore: number; // 0-1
  giStarZ: number; // Getis-Ord Gi* z-score
  giStarP: number; // p-value
  riskLevel: RiskLevel;
  mlRiskScore: number; // 0-100
  topFactors: string[];
  roadSegment: string;
  isOfficialBlackSpot: boolean;
}

export interface RoadSegment {
  id: string;
  name: string;
  coordinates: [number, number][];
  highway: string;
  length: number; // km
  avgDailyTraffic: number;
  speedLimit: number;
  laneCount: number;
  lighting: LightingCondition;
  surfaceCondition: SurfaceCondition;
  mlRiskScore: number;
  predictedAccidents: number; // per year
  shapValues: { feature: string; value: number }[];
}

export interface TimeSeriesData {
  year: number;
  totalAccidents: number;
  fatalAccidents: number;
  seriousAccidents: number;
  minorAccidents: number;
  deaths: number;
  injuries: number;
}

export interface HourlyDistribution {
  hour: number;
  accidents: number;
  fatalities: number;
}

export interface MonthlyDistribution {
  month: string;
  accidents: number;
  fatalities: number;
}

export interface VehicleTypeStats {
  type: string;
  percentage: number;
  fatalityRate: number;
  color: string;
}

export interface AccidentCause {
  cause: string;
  percentage: number;
  color: string;
}

export interface ModelMetrics {
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
}

export interface KeyStats {
  totalAccidents2023: number;
  totalDeaths2023: number;
  fatalityRate: number;
  ncrb2023Rank: number;
  officialBlackSpots: number;
  mlPredictedSpots: number;
  blackSpotsNH44_2019: number;
  fatalitiesReduction2024: number;
  peakHourStart: number;
  peakHourEnd: number;
  peakHourFatalityShare: number;
  twoWheelerVictimShare: number;
  punjabAccidents2023: number;
  punjabDeaths2023: number;
  modelAccuracy: number;
  modelName: string;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
  shapMean?: number;
  description?: string;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

export type HeatmapPointTuple = [number, number, number];
