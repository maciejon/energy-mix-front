export interface EnergyMix {
  biomass?: number;
  coal?: number;
  gas?: number;
  wind?: number;
  solar?: number;
  nuclear?: number;
  hydro?: number;
  imports?: number;
  other?: number;
  [key: string]: number | undefined;
}

export interface DailyEnergyData {
  date: string;
  averageMix: EnergyMix;
  cleanEnergyPercentage: number;
}

export interface ChargingWindow {
  start: string;
  end: string;
  averageCleanEnergyPercentage: number;
}