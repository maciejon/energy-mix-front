import React from 'react';
import { EnergyMixDisplay } from './components/EnergyMixDisplay';
import { ChargingOptimizer } from './components/ChargingOptimizer';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Energy Mix & EV Optimizer</h1>
      </header>

      <main className="app-main">
        <section className="optimizer-section">
          <ChargingOptimizer />
        </section>

        <section className="mix-section">
          <EnergyMixDisplay />
        </section>
      </main>

      <footer className="app-footer">
        Maciej Olpiński 2026
      </footer>
    </div>
  );
};

export default App;