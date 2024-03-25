import React from 'react';
import './LastTempoDisplay.css';

function LastTempoDisplay({ lastTempo }) {
  return (
    <div className="LastTempoDisplay">
      Last Tempo: {lastTempo || 'N/A'}
    </div>
  );
}

export default LastTempoDisplay;
