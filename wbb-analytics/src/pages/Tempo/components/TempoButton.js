import React from 'react';
import './TempoButton.css';

function TempoButton({ tempoType, isTiming, onClick }) {
  return (
    <button className={`TempoButton ${isTiming ? 'active' : ''}`} onClick={onClick}>
      {isTiming ? `Stop ${tempoType} Tempo` : `Start ${tempoType} Tempo`}
    </button>
  );
}

export default TempoButton;
