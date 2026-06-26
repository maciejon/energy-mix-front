import type { DailyEnergyData, ChargingWindow } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_BASE_URL = `${API_BASE}/api/energy`;

export const fetchEnergyMix = async (): Promise<DailyEnergyData[]> => {
  const response = await fetch(`${API_BASE_URL}/mix`);
  if (!response.ok) {
    throw new Error('Błąd podczas pobierania miksu energetycznego');
  }
  return response.json();
};

export const fetchOptimalCharging = async (hours: number): Promise<ChargingWindow> => {
  const response = await fetch(`${API_BASE_URL}/optimal-charging?hours=${hours}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Błąd podczas pobierania optymalnego okna');
  }
  return response.json();
};