import React from 'react';
import './AvgTempo.css';

function AvgTempoDisplay({ avgTempo }) {

  return (
    <div className="AvgTempoDisplay">
      Avg Tempo: {avgTempo || 'N/A'}
    </div>
  );
}

export default AvgTempoDisplay;
