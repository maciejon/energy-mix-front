import React, { useState } from 'react';
import { fetchOptimalCharging } from '../api/energyService';
import type { ChargingWindow } from '../types';
import { BatteryCharging, Clock, Zap } from 'lucide-react';

export const ChargingOptimizer: React.FC = () => {
  const [hours, setHours] = useState<number>(1);
  const [result, setResult] = useState<ChargingWindow | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await fetchOptimalCharging(hours);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(isoString));
  };

  return (
    <div className="card">
      <h2>Znajdź optymalne okno ładowania EV</h2>
      <p className="subtitle">Algorytm znajdzie przedział czasowy z największym udziałem czystej energii.</p>

      <form onSubmit={handleSubmit} className="optimizer-form">
        <label htmlFor="hours">Czas ładowania (w godzinach):</label>
        <div className="input-group">
          <input
            id="hours"
            type="number"
            min="1"
            max="6"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Szukanie...' : 'Oblicz'}
          </button>
        </div>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result-card">
          <h3>Najlepszy moment na ładowanie</h3>
          
          <div className="result-details">
            <div className="detail-item">
              <Clock className="icon" />
              <div>
                <span>Początek:</span>
                <strong>{formatDate(result.start)}</strong>
              </div>
            </div>
            
            <div className="detail-item">
              <Clock className="icon" />
              <div>
                <span>Koniec:</span>
                <strong>{formatDate(result.end)}</strong>
              </div>
            </div>

            <div className="detail-item highlight">
              <Zap className="icon" />
              <div>
                <span>Średni udział czystej energii:</span>
                <strong>{result.averageCleanEnergyPercentage.toFixed(1)}%</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};