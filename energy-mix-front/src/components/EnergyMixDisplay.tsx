import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchEnergyMix } from '../api/energyService';
import type { DailyEnergyData } from '../types';

const COLORS: Record<string, string> = {
  wind: '#0ea5e9',   
  solar: '#eab308',   
  biomass: '#22c55e', 
  hydro: '#3b82f6',  
  nuclear: '#a855f7', 
  gas: '#f97316',    
  coal: '#475569',  
  imports: '#94a3b8',
  other: '#cbd5e1'
};

export const EnergyMixDisplay: React.FC = () => {
  const [data, setData] = useState<DailyEnergyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const mixData = await fetchEnergyMix();
        setData(mixData);
      } catch (err) {
        setError('Nie udało się załadować danych o miksie energetycznym.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="loading">Ładowanie danych energetycznych...</div>;
  if (error) return <div className="error">{error}</div>;

  const getDayLabel = (index: number, dateStr: string) => {
    if (index === 0) return `Dzisiaj (${dateStr})`;
    if (index === 1) return `Jutro (${dateStr})`;
    if (index === 2) return `Pojutrze (${dateStr})`;
    return dateStr;
  };

  return (
    <div className="card">
      <h2>Prognoza miksu energetycznego (Wielka Brytania)</h2>
      <div className="charts-grid">
        {data.map((day, index) => {
          
          // transformacja obiektu na tablicę dla Recharts
          const chartData = Object.entries(day.averageMix)
            .map(([name, value]) => ({ name, value }))
            .filter((item): item is { name: string; value: number } => 
              item.value !== undefined && item.value > 0
            );

          return (
            <div key={day.date} className="chart-card">
              <h3>{getDayLabel(index, day.date)}</h3>
              <div className="clean-energy-badge">
                Czysta energia: <strong>{day.cleanEnergyPercentage.toFixed(1)}%</strong>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[entry.name] || COLORS.other} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => {
                        const numericValue = Number(value);
                        return isNaN(numericValue) ? '' : `${numericValue.toFixed(1)}%`;
                      }} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};