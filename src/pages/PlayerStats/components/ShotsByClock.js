import React from 'react';
import './ShotsByClock.css';

function ShotsByClock({ section, made, total }) {
    return (
      <section className="shots-card">
        <header className="shots-title">{section} seconds</header>
        <div className="shots-value">
          {made}/{total}
        </div>
      </section>
    );
  }
  
  export default ShotsByClock;
  